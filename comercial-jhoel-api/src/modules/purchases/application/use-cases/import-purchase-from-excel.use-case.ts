import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { CreatePurchaseUseCase } from './create-purchase.use-case';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentation } from '../../../inventory/domain/entities/product-presentation.entity';
import { INVENTORY_LOCATION_REPOSITORY } from '../../../inventory/domain/repositories/inventory-location.repository';
import type { InventoryLocationRepository } from '../../../inventory/domain/repositories/inventory-location.repository';
import { RegisterInventoryTransferUseCase } from '../../../inventory/application/use-cases/register-inventory-transfer.use-case';
import { SUPPLIER_REPOSITORY } from '../../../suppliers/domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../../suppliers/domain/repositories/supplier.repository';
import { DomainError } from '../../../../shared/domain/domain-error';
import { PURCHASE_IMPORT_HEADERS } from '../../infrastructure/excel/purchase-import.builder';

export interface ImportPurchaseRowResult {
  row: number;
  identifier: string;
  reason: string;
}

export interface ImportPurchaseFromExcelOutput {
  totalRows: number;
  productsAffected: number;
  purchasesCreated: number;
  /** How many rows were relocated to Vitrina after their purchase — see `transferWarnings` for the ones that couldn't be. */
  transfersToVitrina: number;
  skipped: ImportPurchaseRowResult[];
  /** The row's purchase already succeeded (stock is in Bodega, real and saved) — only the follow-up relocation to Vitrina failed. Never a reason to re-import the row; a manual "Trasladar inventario" finishes the job. */
  transferWarnings: ImportPurchaseRowResult[];
}

type DestinationLocationName = 'Bodega' | 'Vitrina';

interface ResolvedItem {
  row: number;
  identifier: string;
  productId: string;
  presentationId?: string;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  destination: DestinationLocationName;
}

/** Defensive ceiling, higher than Products' own 500 — here a single product can legitimately span several rows (one per presentation), so 1,000+ products realistically need more rows than products. */
const IMPORT_ROW_LIMIT = 3000;

/**
 * Items are grouped into purchases of at most this many lines each, rather
 * than one purchase with every resolved item — bounds how long
 * `confirm_purchase()`'s `FOR UPDATE` locks are held per transaction, and
 * means a failure partway through the file still leaves every earlier batch
 * committed instead of rolling back the whole import.
 */
const PURCHASE_BATCH_SIZE = 200;

/** Seeded once by migration `SeedInitialStockSupplier` — every purchase this import creates is attributed to it, so the resulting stock is identifiable in Reportería/Kardex as coming from the initial catalog load, not a real supplier invoice. */
const INITIAL_STOCK_SUPPLIER_NAME = 'Carga Inicial de Inventario';

const DEFAULT_DESTINATION: DestinationLocationName = 'Bodega';

/**
 * Reads an `.xlsx` built to `PURCHASE_IMPORT_HEADERS`'s 5-column shape
 * (SKU, Producto, Presentación, Cantidad, Ubicación Destino) and registers
 * the described quantities as one or more real purchases — always by
 * delegating to `CreatePurchaseUseCase.execute()`, the same use case
 * "Registrar compra" already calls, never a parallel copy of its
 * conversion/stock logic. This is what guarantees the presentation→base-
 * units conversion (`quantity × conversionFactor`) happens exactly the way
 * it already does for a normal purchase — this use case never computes
 * that math itself.
 *
 * A product can span several rows — one per presentation ("2 Cajas" +
 * "5 Unidades" of the same product is two rows) — resolved independently
 * and passed through as separate purchase line items, relying on
 * `CreatePurchaseUseCase`'s own existing `(productId, presentationId)`
 * dedup rather than merging them here.
 *
 * Every price is reused from the presentation's own already-loaded
 * `costPrice`/`publicPrice` — the Excel never carries a price column, so
 * `confirm_purchase()`'s side effect of overwriting the product/presentation
 * price on write is always a no-op (same value in, same value out).
 *
 * `confirm_purchase()` always writes into Bodega, unconditionally — that
 * never changes here. A row whose "Ubicación Destino" is Vitrina is
 * relocated there immediately after its batch's purchase succeeds, via
 * `RegisterInventoryTransferUseCase` — the exact same mechanism "Trasladar
 * inventario" already uses, not a second purchase destination taught to
 * the stored function.
 *
 * Rows are resolved sequentially and never abort the whole file — an
 * unresolvable row (unknown SKU/nombre, unknown presentación, cantidad o
 * ubicación destino inválida) is recorded in `skipped` with a reason and
 * processing continues. Successfully-resolved items are grouped into
 * batches of `PURCHASE_BATCH_SIZE` and registered as separate purchases; a
 * batch that fails to confirm (a genuinely unexpected condition, since
 * every item was already validated to exist) reports its own rows as
 * skipped too, without touching batches already committed. A row destined
 * for Vitrina whose purchase succeeded but whose follow-up transfer failed
 * goes to `transferWarnings` instead — the stock is real either way, only
 * its current location differs from what was requested.
 */
@Injectable()
export class ImportPurchaseFromExcelUseCase {
  constructor(
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly registerInventoryTransferUseCase: RegisterInventoryTransferUseCase,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly productPresentationRepository: ProductPresentationRepository,
    @Inject(INVENTORY_LOCATION_REPOSITORY)
    private readonly inventoryLocationRepository: InventoryLocationRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(fileBuffer: Buffer, userId: string): Promise<ImportPurchaseFromExcelOutput> {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(fileBuffer as unknown as ExcelJS.Buffer);
    } catch {
      throw new BadRequestException(
        'El archivo no es un Excel (.xlsx) válido. Si tienes un archivo .xls, ábrelo y usa "Guardar como" para convertirlo a .xlsx.',
      );
    }

    const sheet = workbook.worksheets[0];
    if (!sheet || sheet.rowCount === 0) {
      throw new BadRequestException('El archivo no contiene ninguna hoja con datos.');
    }

    const headerRow = sheet.getRow(1);
    const headersMatch = PURCHASE_IMPORT_HEADERS.every((expected, index) => {
      const actual = String(headerRow.getCell(index + 1).value ?? '').trim();
      return actual.toLowerCase() === expected.toLowerCase();
    });
    if (!headersMatch) {
      throw new BadRequestException(
        `Los encabezados del archivo no coinciden con la plantilla esperada. Descarga la plantilla e intenta de nuevo. Encabezados esperados: ${PURCHASE_IMPORT_HEADERS.join(', ')}.`,
      );
    }

    const rawDataRowCount = sheet.rowCount - 1;
    if (rawDataRowCount > IMPORT_ROW_LIMIT) {
      throw new BadRequestException(
        `El archivo tiene ${rawDataRowCount} filas de datos — el máximo permitido por importación es ${IMPORT_ROW_LIMIT}. Divide el archivo en partes más pequeñas.`,
      );
    }

    const skipped: ImportPurchaseRowResult[] = [];
    const resolvedItems: ResolvedItem[] = [];
    const presentationsByProductId = new Map<string, ProductPresentation[]>();
    let totalRows = 0;

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      const cellValues = Array.from({ length: 5 }, (_, i) => row.getCell(i + 1).value);
      const isBlankRow = cellValues.every((value) => value === null || value === undefined || value === '');
      if (isBlankRow) {
        continue;
      }
      totalRows += 1;

      const sku = this.cellText(cellValues[0]);
      const productName = this.cellText(cellValues[1]);
      const presentationName = this.cellText(cellValues[2]);
      const identifier = sku || productName || '(sin identificar)';

      if (!sku && !productName) {
        skipped.push({ row: rowNumber, identifier: '(sin identificar)', reason: 'Falta el SKU o el nombre del producto.' });
        continue;
      }
      if (!presentationName) {
        skipped.push({ row: rowNumber, identifier, reason: 'Falta la presentación.' });
        continue;
      }

      const quantity = this.cellNumber(cellValues[3]);
      if (quantity === null || !Number.isInteger(quantity) || quantity <= 0) {
        skipped.push({ row: rowNumber, identifier, reason: 'La cantidad debe ser un número entero mayor a 0.' });
        continue;
      }

      const destinationRaw = this.cellText(cellValues[4]);
      const destination = this.resolveDestination(destinationRaw);
      if (!destination) {
        skipped.push({
          row: rowNumber,
          identifier,
          reason: `La ubicación destino "${destinationRaw}" no es válida — debe ser "Bodega" o "Vitrina".`,
        });
        continue;
      }

      const product = sku
        ? await this.productRepository.findByActiveSku(sku)
        : await this.productRepository.findByActiveName(productName);
      if (!product) {
        skipped.push({
          row: rowNumber,
          identifier,
          reason: sku
            ? `No existe un producto activo con el SKU "${sku}".`
            : `No existe un producto activo llamado "${productName}".`,
        });
        continue;
      }

      let presentations = presentationsByProductId.get(product.id);
      if (!presentations) {
        presentations = await this.productPresentationRepository.findByProductId(product.id, { activeOnly: true });
        presentationsByProductId.set(product.id, presentations);
      }
      const normalizedPresentationName = presentationName.trim().toLowerCase();
      const presentation = presentations.find((p) => p.name.trim().toLowerCase() === normalizedPresentationName);
      if (!presentation) {
        skipped.push({
          row: rowNumber,
          identifier,
          reason: `La presentación "${presentationName}" no existe o está inactiva para este producto.`,
        });
        continue;
      }

      resolvedItems.push({
        row: rowNumber,
        identifier,
        productId: product.id,
        presentationId: presentation.name === 'Unidad' ? undefined : presentation.id,
        quantity,
        costPrice: presentation.costPrice,
        publicPrice: presentation.publicPrice,
        destination,
      });
    }

    if (resolvedItems.length === 0) {
      return { totalRows, productsAffected: 0, purchasesCreated: 0, transfersToVitrina: 0, skipped, transferWarnings: [] };
    }

    const supplierId = await this.resolveInitialStockSupplierId();
    const needsVitrina = resolvedItems.some((item) => item.destination === 'Vitrina');
    const { bodegaId, vitrinaId } = needsVitrina
      ? await this.resolveLocationIds()
      : { bodegaId: '', vitrinaId: '' };

    let purchasesCreated = 0;
    let transfersToVitrina = 0;
    const transferWarnings: ImportPurchaseRowResult[] = [];
    const successfulProductIds = new Set<string>();
    for (let i = 0; i < resolvedItems.length; i += PURCHASE_BATCH_SIZE) {
      const batch = resolvedItems.slice(i, i + PURCHASE_BATCH_SIZE);
      try {
        await this.createPurchaseUseCase.execute({
          supplierId,
          userId,
          purchaseDate: new Date(),
          paymentType: 'CONTADO',
          items: batch.map((item) => ({
            productId: item.productId,
            presentationId: item.presentationId,
            quantity: item.quantity,
            costPrice: item.costPrice,
            publicPrice: item.publicPrice,
          })),
        });
        purchasesCreated += 1;
        for (const item of batch) {
          successfulProductIds.add(item.productId);
        }
      } catch (error) {
        const reason =
          error instanceof DomainError ? error.message : 'No se pudo registrar este lote de la compra inicial.';
        for (const item of batch) {
          skipped.push({ row: item.row, identifier: item.identifier, reason });
        }
        continue;
      }

      // The batch's purchase is already real and saved (every line just
      // entered Bodega) — a row asking for Vitrina now gets relocated,
      // one transfer per line (the transfer mechanism has no bulk form).
      // A failure here never undoes the purchase; it only means the stock
      // stays in Bodega instead of moving, reported separately below.
      for (const item of batch) {
        if (item.destination !== 'Vitrina') {
          continue;
        }
        try {
          await this.registerInventoryTransferUseCase.execute({
            productId: item.productId,
            presentationId: item.presentationId,
            fromLocationId: bodegaId,
            toLocationId: vitrinaId,
            quantity: item.quantity,
            userId,
            reason: 'Carga inicial de inventario',
          });
          transfersToVitrina += 1;
        } catch (error) {
          const reason =
            error instanceof DomainError
              ? `Se compró correctamente, pero no se pudo trasladar a Vitrina: ${error.message}`
              : 'Se compró correctamente, pero no se pudo trasladar a Vitrina.';
          transferWarnings.push({ row: item.row, identifier: item.identifier, reason });
        }
      }
    }

    return {
      totalRows,
      productsAffected: successfulProductIds.size,
      purchasesCreated,
      transfersToVitrina,
      skipped,
      transferWarnings,
    };
  }

  private async resolveInitialStockSupplierId(): Promise<string> {
    const suppliers = await this.supplierRepository.findAll({ activeOnly: true });
    const normalizedTarget = INITIAL_STOCK_SUPPLIER_NAME.toLowerCase();
    const supplier = suppliers.find((s) => s.name.trim().toLowerCase() === normalizedTarget);
    if (!supplier) {
      throw new InternalServerErrorException(
        `No se encontró el proveedor "${INITIAL_STOCK_SUPPLIER_NAME}" — verifica que las migraciones se hayan ejecutado.`,
      );
    }
    return supplier.id;
  }

  private async resolveLocationIds(): Promise<{ bodegaId: string; vitrinaId: string }> {
    const locations = await this.inventoryLocationRepository.findAll({ activeOnly: true });
    const bodega = locations.find((l) => l.name.trim().toLowerCase() === 'bodega');
    const vitrina = locations.find((l) => l.name.trim().toLowerCase() === 'vitrina');
    if (!bodega || !vitrina) {
      throw new InternalServerErrorException(
        'No se encontraron las ubicaciones "Bodega"/"Vitrina" — verifica que las migraciones se hayan ejecutado.',
      );
    }
    return { bodegaId: bodega.id, vitrinaId: vitrina.id };
  }

  private resolveDestination(raw: string): DestinationLocationName | null {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) {
      return DEFAULT_DESTINATION;
    }
    if (normalized === 'bodega') {
      return 'Bodega';
    }
    if (normalized === 'vitrina') {
      return 'Vitrina';
    }
    return null;
  }

  private cellText(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object' && 'text' in (value as Record<string, unknown>)) {
      // A cell with rich text/hyperlink formatting — exceljs returns an object instead of a plain string.
      return String((value as { text: unknown }).text ?? '').trim();
    }
    return String(value).trim();
  }

  private cellNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }
    const cleaned = String(value).replace(/[Qq,\s]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

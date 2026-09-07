import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { CreateProductUseCase } from './create-product.use-case';
import { CreatePresentationUseCase } from '../../../inventory/application/use-cases/create-presentation.use-case';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../../units-of-measure/domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../../units-of-measure/domain/repositories/unit-of-measure.repository';
import { PRESENTATION_TYPE_REPOSITORY } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import { DomainError } from '../../../../shared/domain/domain-error';
import { PRODUCTS_IMPORT_HEADERS } from '../../infrastructure/excel/products-excel.builder';

export interface ImportProductsRowResult {
  row: number;
  name: string;
  reason: string;
}

export interface ImportProductsFromExcelOutput {
  totalRows: number;
  created: number;
  createdNames: string[];
  skipped: ImportProductsRowResult[];
  /**
   * The product itself WAS created successfully — only its optional extra
   * presentation (columns 10-13) failed. Kept separate from `skipped`
   * because these products are already real, saved inventory rows; the fix
   * is adding the presentation by hand via "Agregar presentación", not
   * re-importing the row.
   */
  presentationWarnings: ImportProductsRowResult[];
}

/** Defensive ceiling only — nothing in this system is expected to approach it in one file; a genuinely larger catalog should be split into a few uploads. */
const IMPORT_ROW_LIMIT = 500;

/** See `resolvePresentationRequest()`'s own doc comment for what each `kind` means. */
type PresentationRequestResult =
  | { kind: 'none' }
  | { kind: 'error'; reason: string }
  | {
      kind: 'valid';
      presentationTypeId: string;
      conversionFactor: number;
      costPrice: number;
      publicPrice: number;
    };

/**
 * Reads an `.xlsx` built to `PRODUCTS_IMPORT_HEADERS`'s exact 13-column
 * shape and creates one product per valid row — always by delegating to
 * `CreateProductUseCase.execute()`, the *same* use case the manual
 * "Agregar producto" form already calls, never a parallel copy of its
 * validation/creation logic. This is what guarantees an imported product
 * ends up byte-identical to a manually-created one: same base "Unidad"
 * presentation, same initial stock placement into "Bodega" (see that use
 * case's own doc comment — this import does not change or special-case any
 * of that).
 *
 * Columns 10-13 optionally describe **one** extra presentation (Caja,
 * Paquete, ...) per row, created via `CreatePresentationUseCase` — the same
 * use case "Agregar presentación" already calls — right after the base
 * product. See `resolvePresentationRequest()`'s own doc comment for exactly
 * how that group is validated.
 *
 * Rows are processed strictly sequentially (never `Promise.all`) — so a
 * within-file duplicate name is deterministically caught by this use case
 * itself (`seenNames`) before ever reaching the database, and two rows
 * naming the same not-yet-existing product can't race each other into two
 * separate `ProductNameAlreadyExistsError`-free inserts.
 *
 * A row that fails for any reason (missing field, unknown categoría/
 * negocio/unidad, duplicate name — in-file or already in the database) is
 * recorded in `skipped` with a human-readable reason and processing simply
 * continues with the next row — never aborts the whole file. A problem
 * confined to the *optional presentation* columns never has this effect —
 * see `presentationWarnings` above.
 */
@Injectable()
export class ImportProductsFromExcelUseCase {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly createPresentationUseCase: CreatePresentationUseCase,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(fileBuffer: Buffer): Promise<ImportProductsFromExcelOutput> {
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
    const headersMatch = PRODUCTS_IMPORT_HEADERS.every((expected, index) => {
      const actual = String(headerRow.getCell(index + 1).value ?? '').trim();
      return actual.toLowerCase() === expected.toLowerCase();
    });
    if (!headersMatch) {
      throw new BadRequestException(
        `Los encabezados del archivo no coinciden con la plantilla esperada. Descarga la plantilla e intenta de nuevo. Encabezados esperados: ${PRODUCTS_IMPORT_HEADERS.join(', ')}.`,
      );
    }

    const rawDataRowCount = sheet.rowCount - 1;
    if (rawDataRowCount > IMPORT_ROW_LIMIT) {
      throw new BadRequestException(
        `El archivo tiene ${rawDataRowCount} filas de datos — el máximo permitido por importación es ${IMPORT_ROW_LIMIT}. Divide el archivo en partes más pequeñas.`,
      );
    }

    const skipped: ImportProductsRowResult[] = [];
    const presentationWarnings: ImportProductsRowResult[] = [];
    const createdNames: string[] = [];
    const seenNames = new Set<string>();
    let totalRows = 0;

    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);
      const cellValues = Array.from({ length: 13 }, (_, i) => row.getCell(i + 1).value);
      const isBlankRow = cellValues.every((value) => value === null || value === undefined || value === '');
      if (isBlankRow) {
        continue;
      }
      totalRows += 1;

      const name = this.cellText(cellValues[0]);
      if (!name) {
        skipped.push({ row: rowNumber, name: '(sin nombre)', reason: 'Falta el nombre del producto.' });
        continue;
      }

      const normalizedName = name.toLowerCase();
      if (seenNames.has(normalizedName)) {
        skipped.push({ row: rowNumber, name, reason: 'Nombre duplicado dentro del mismo archivo.' });
        continue;
      }

      const sku = this.cellText(cellValues[1]) || undefined;
      const categoryName = this.cellText(cellValues[2]);
      const businessName = this.cellText(cellValues[3]);
      const unitName = this.cellText(cellValues[4]);
      const costPrice = this.cellNumber(cellValues[5]);
      const publicPrice = this.cellNumber(cellValues[6]);
      const wholesalePrice = this.cellNumber(cellValues[7]);
      const stockRaw = cellValues[8];
      const stock = stockRaw === null || stockRaw === undefined || stockRaw === '' ? 0 : this.cellNumber(cellValues[8]);

      if (!categoryName) {
        skipped.push({ row: rowNumber, name, reason: 'Falta la categoría.' });
        continue;
      }
      if (!businessName) {
        skipped.push({ row: rowNumber, name, reason: 'Falta el negocio.' });
        continue;
      }
      if (!unitName) {
        skipped.push({ row: rowNumber, name, reason: 'Falta la unidad de medida.' });
        continue;
      }
      if (costPrice === null || costPrice <= 0) {
        skipped.push({ row: rowNumber, name, reason: 'Precio costo inválido — debe ser un número mayor a 0.' });
        continue;
      }
      if (publicPrice === null || publicPrice <= 0) {
        skipped.push({ row: rowNumber, name, reason: 'Precio público inválido — debe ser un número mayor a 0.' });
        continue;
      }
      if (wholesalePrice === null || wholesalePrice <= 0) {
        skipped.push({ row: rowNumber, name, reason: 'Precio mayorista inválido — debe ser un número mayor a 0.' });
        continue;
      }
      if (stock === null || stock < 0 || !Number.isInteger(stock)) {
        skipped.push({ row: rowNumber, name, reason: 'Stock inicial inválido — debe ser un número entero mayor o igual a 0.' });
        continue;
      }

      const category = await this.categoryRepository.findByActiveName(categoryName);
      if (!category) {
        skipped.push({ row: rowNumber, name, reason: `La categoría "${categoryName}" no existe o está inactiva.` });
        continue;
      }

      const business = await this.businessRepository.findByActiveName(businessName);
      if (!business) {
        skipped.push({ row: rowNumber, name, reason: `El negocio "${businessName}" no existe o está inactivo.` });
        continue;
      }

      const unitOfMeasure = await this.unitOfMeasureRepository.findByActiveName(unitName);
      if (!unitOfMeasure) {
        skipped.push({ row: rowNumber, name, reason: `La unidad de medida "${unitName}" no existe o está inactiva.` });
        continue;
      }

      // The 4 presentation columns (10-13) are a single optional group —
      // filling any one of them means the row is asking for one extra
      // presentation (beyond the always-auto-created base "Unidad").
      // Resolved/validated *before* creating the product so a bad
      // presentation type name doesn't need a second round-trip, but a
      // problem here only ever becomes a warning below — it can never stop
      // the base product itself from being created.
      const presentationRequest = await this.resolvePresentationRequest(cellValues);

      let createdProductId: string;
      try {
        const createdProduct = await this.createProductUseCase.execute({
          name,
          sku,
          categoryId: category.id,
          businessId: business.id,
          unitOfMeasureId: unitOfMeasure.id,
          costPrice,
          publicPrice,
          wholesalePrice,
          stock,
        });
        createdProductId = createdProduct.id;
        seenNames.add(normalizedName);
        createdNames.push(name);
      } catch (error) {
        const reason = error instanceof DomainError ? error.message : 'No se pudo crear el producto.';
        skipped.push({ row: rowNumber, name, reason });
        continue;
      }

      if (presentationRequest.kind === 'error') {
        presentationWarnings.push({ row: rowNumber, name, reason: presentationRequest.reason });
      } else if (presentationRequest.kind === 'valid') {
        try {
          await this.createPresentationUseCase.execute({
            productId: createdProductId,
            presentationTypeId: presentationRequest.presentationTypeId,
            conversionFactor: presentationRequest.conversionFactor,
            costPrice: presentationRequest.costPrice,
            publicPrice: presentationRequest.publicPrice,
          });
        } catch (error) {
          const reason = error instanceof DomainError ? error.message : 'No se pudo crear la presentación adicional.';
          presentationWarnings.push({ row: rowNumber, name, reason });
        }
      }
    }

    return {
      totalRows,
      created: createdNames.length,
      createdNames,
      skipped,
      presentationWarnings,
    };
  }

  /**
   * Columns 10-13 are a single optional group. `kind: 'none'` is the common
   * case — every one of them is blank, so the row only needs the base
   * "Unidad" presentation, auto-created regardless by `CreateProductUseCase`
   * itself. `kind: 'error'` means at least one is filled but the group as a
   * whole doesn't resolve to something `CreatePresentationUseCase` could
   * accept — the caller turns that into a warning, never a reason to skip
   * the base product. `kind: 'valid'` carries the resolved, ready-to-use
   * fields.
   */
  private async resolvePresentationRequest(cellValues: unknown[]): Promise<PresentationRequestResult> {
    const presentationTypeName = this.cellText(cellValues[9]);
    const factorRaw = cellValues[10];
    const costPriceRaw = cellValues[11];
    const publicPriceRaw = cellValues[12];
    const isBlank = (value: unknown) => value === null || value === undefined || value === '';

    if (
      !presentationTypeName &&
      isBlank(factorRaw) &&
      isBlank(costPriceRaw) &&
      isBlank(publicPriceRaw)
    ) {
      return { kind: 'none' };
    }

    if (!presentationTypeName) {
      return {
        kind: 'error',
        reason: 'Falta el tipo de presentación adicional (Factor/precios sin tipo de presentación).',
      };
    }

    const conversionFactor = this.cellNumber(factorRaw);
    if (conversionFactor === null || !Number.isInteger(conversionFactor) || conversionFactor <= 0) {
      return {
        kind: 'error',
        reason: 'El factor de presentación debe ser un número entero mayor a 0.',
      };
    }

    const costPrice = this.cellNumber(costPriceRaw);
    if (costPrice === null || costPrice < 0) {
      return { kind: 'error', reason: 'El precio costo de la presentación adicional es inválido.' };
    }

    const publicPrice = this.cellNumber(publicPriceRaw);
    if (publicPrice === null || publicPrice < 0) {
      return { kind: 'error', reason: 'El precio público de la presentación adicional es inválido.' };
    }

    const presentationType = await this.presentationTypeRepository.findByActiveName(presentationTypeName);
    if (!presentationType) {
      return {
        kind: 'error',
        reason: `El tipo de presentación "${presentationTypeName}" no existe o está inactivo.`,
      };
    }

    return {
      kind: 'valid',
      presentationTypeId: presentationType.id,
      conversionFactor,
      costPrice,
      publicPrice,
    };
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

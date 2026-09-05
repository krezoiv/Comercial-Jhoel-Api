import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { formatCurrency } from '../../../../shared/infrastructure/pdf/pdf-helpers';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../../reports/infrastructure/pdf/report-pdf.builder';

export interface ExportProductsPdfInput {
  search?: string;
  categoryId?: string;
  businessId?: string;
  sortBy?: 'name' | 'costPrice' | 'publicPrice' | 'wholesalePrice' | 'stock' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  includeInactive?: boolean;
  generatedByUsername: string;
}

/**
 * Same ceiling/reasoning as every other Reportería PDF export
 * (`EXPORT_ROW_LIMIT` in `export-sales-report-pdf.use-case.ts`) — a printed
 * table has a practical size limit; the web view (and the Excel export,
 * which has no such limit) still show everything.
 */
const EXPORT_ROW_LIMIT = 500;

/**
 * Reuses the same generic `buildReportPdf()` every Reportería export already
 * uses (Ventas/Compras/Recargas/...) — Inventario's export is a filtered
 * table-plus-summary document exactly like those, not a "documento" in the
 * Venta/Compra/Ticket/Cotización sense, so it belongs to that family, not a
 * second bespoke builder.
 */
@Injectable()
export class ExportProductsPdfUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(input: ExportProductsPdfInput): Promise<Buffer> {
    const [result, filterLines] = await Promise.all([
      this.productRepository.findAll({
        activeOnly: !input.includeInactive,
        search: input.search?.trim() || undefined,
        categoryId: input.categoryId,
        businessId: input.businessId,
        sortBy: input.sortBy ?? 'name',
        sortDirection: input.sortDirection ?? 'asc',
        page: 1,
        limit: EXPORT_ROW_LIMIT,
      }),
      this.resolveFilterLines(input),
    ]);

    const activeCount = result.items.filter((item) => item.isActive).length;
    const totalStockValue = result.items.reduce(
      (sum, item) => sum + item.costPrice * item.stock,
      0,
    );

    const rows = result.items.map((item) => [
      item.name,
      item.sku ?? '—',
      item.categoryName,
      item.businessName,
      `${item.stock} ${item.unitOfMeasureAbbreviation}`,
      formatCurrency(item.costPrice),
      formatCurrency(item.publicPrice),
      item.isActive ? 'Activo' : 'Inactivo',
    ]);

    return buildReportPdf({
      reportTitle: 'INVENTARIO DE PRODUCTOS',
      periodLabel: 'Estado actual',
      filters: filterLines,
      summary: [
        { label: 'Total de productos', value: String(result.total) },
        { label: 'Activos', value: String(activeCount) },
        { label: 'Inactivos', value: String(result.total - activeCount) },
        { label: 'Valor de inventario (costo)', value: formatCurrency(totalStockValue) },
      ],
      columns: [
        { header: 'Producto', width: 100 },
        { header: 'SKU', width: 55 },
        { header: 'Categoría', width: 65 },
        { header: 'Negocio', width: 55 },
        { header: 'Stock', width: 50, align: 'right' },
        { header: 'P. Costo', width: 55, align: 'right' },
        { header: 'P. Público', width: 55, align: 'right' },
        { header: 'Estado', width: 45, align: 'center' },
      ],
      rows,
      generatedAt: new Date(),
      generatedByUsername: input.generatedByUsername,
      truncationNotice:
        result.total > EXPORT_ROW_LIMIT
          ? `Se muestran los primeros ${EXPORT_ROW_LIMIT} de ${result.total} productos encontrados. Usa la exportación a Excel para el detalle completo.`
          : undefined,
    });
  }

  private async resolveFilterLines(
    input: ExportProductsPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];

    if (input.search) {
      lines.push({ label: 'Búsqueda', value: input.search });
    }
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      lines.push({ label: 'Categoría', value: category?.name ?? '—' });
    }
    if (input.businessId) {
      const business = await this.businessRepository.findById(input.businessId);
      lines.push({ label: 'Negocio', value: business?.name ?? '—' });
    }
    lines.push({
      label: 'Incluye inactivos',
      value: input.includeInactive ? 'Sí' : 'No',
    });

    return lines;
  }
}

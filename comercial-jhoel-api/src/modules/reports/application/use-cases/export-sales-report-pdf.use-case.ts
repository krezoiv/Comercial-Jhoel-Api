import { Inject, Injectable } from '@nestjs/common';
import { SALES_REPORT_REPOSITORY } from '../../domain/repositories/sales-report.repository';
import type { SalesReportRepository } from '../../domain/repositories/sales-report.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  formatReportCurrency,
  formatReportQuantity,
  formatReportDate,
  formatReportPeriodLabel,
} from '../utils/report-format.util';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportSalesReportPdfInput {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
  generatedByUsername: string;
}

/**
 * PDF export is capped at a sane row count rather than dumping an unbounded
 * result set into one document — a report spanning years of sales would
 * otherwise produce an enormous, slow-to-render file. The web view still
 * paginates through everything; only the PDF has this ceiling, and it's
 * called out in the document itself (`truncationNotice`) when it's hit.
 */
const EXPORT_ROW_LIMIT = 500;

@Injectable()
export class ExportSalesReportPdfUseCase {
  constructor(
    @Inject(SALES_REPORT_REPOSITORY)
    private readonly salesReportRepository: SalesReportRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ExportSalesReportPdfInput): Promise<Buffer> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const filters = {
      startDate,
      endDate,
      categoryId: input.categoryId,
      businessId: input.businessId,
      productId: input.productId,
      userId: input.userId,
    };

    // Same filters drive the list and the summary here as everywhere else
    // in this module — the PDF can never show a total that doesn't match
    // the rows printed under it.
    const [listResult, summary, filterLines] = await Promise.all([
      this.salesReportRepository.findAll(
        filters,
        1,
        EXPORT_ROW_LIMIT,
        'date',
        'desc',
      ),
      this.salesReportRepository.getSummary(filters),
      this.resolveFilterLines(input),
    ]);

    const rows = listResult.items.map((item) => [
      formatReportDate(item.saleDate),
      item.saleNumber,
      item.username,
      formatReportQuantity(item.itemCount),
      formatReportCurrency(item.total),
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE VENTAS',
      periodLabel: formatReportPeriodLabel(startDate, endDate),
      filters: filterLines,
      summary: [
        {
          label: 'Total de ventas',
          value: formatReportCurrency(summary.totalAmount),
        },
        {
          label: 'Cantidad de ventas',
          value: formatReportQuantity(summary.salesCount),
        },
        {
          label: 'Productos vendidos',
          value: formatReportQuantity(summary.unitsSold),
        },
        {
          label: 'Promedio por venta',
          value: formatReportCurrency(summary.averageTicket),
        },
      ],
      columns: [
        { header: 'Fecha', width: 70 },
        { header: 'Venta', width: 85 },
        { header: 'Usuario', width: 130 },
        { header: 'Productos', width: 65, align: 'right' },
        { header: 'Total', width: 90, align: 'right' },
      ],
      rows,
      generatedAt: new Date(),
      generatedByUsername: input.generatedByUsername,
      truncationNotice:
        listResult.total > EXPORT_ROW_LIMIT
          ? `Se muestran los primeros ${EXPORT_ROW_LIMIT} de ${listResult.total} registros encontrados. Aplica un rango de fechas más específico para exportar el detalle completo.`
          : undefined,
    });
  }

  /** Resolves each filter id to its display name — a PDF showing a raw UUID would be useless to a reader. */
  private async resolveFilterLines(
    input: ExportSalesReportPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      lines.push({ label: 'Categoría', value: category?.name ?? '—' });
    }
    if (input.businessId) {
      const business = await this.businessRepository.findById(input.businessId);
      lines.push({ label: 'Negocio', value: business?.name ?? '—' });
    }
    if (input.productId) {
      const product = await this.productRepository.findById(input.productId);
      lines.push({ label: 'Producto', value: product?.name ?? '—' });
    }
    if (input.userId) {
      const user = await this.userRepository.findById(input.userId);
      lines.push({
        label: 'Usuario',
        value: user?.username ?? user?.name ?? '—',
      });
    }

    return lines;
  }
}

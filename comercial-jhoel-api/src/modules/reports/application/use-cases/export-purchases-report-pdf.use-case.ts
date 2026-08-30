import { Inject, Injectable } from '@nestjs/common';
import { PURCHASES_REPORT_REPOSITORY } from '../../domain/repositories/purchases-report.repository';
import type { PurchasesReportRepository } from '../../domain/repositories/purchases-report.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SUPPLIER_REPOSITORY } from '../../../suppliers/domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../../suppliers/domain/repositories/supplier.repository';
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

export interface ExportPurchasesReportPdfInput {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
  generatedByUsername: string;
}

/** Same reasoning as `ExportSalesReportPdfUseCase`'s cap — see that file's doc comment. */
const EXPORT_ROW_LIMIT = 500;

@Injectable()
export class ExportPurchasesReportPdfUseCase {
  constructor(
    @Inject(PURCHASES_REPORT_REPOSITORY)
    private readonly purchasesReportRepository: PurchasesReportRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(input: ExportPurchasesReportPdfInput): Promise<Buffer> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const filters = {
      startDate,
      endDate,
      supplierId: input.supplierId,
      categoryId: input.categoryId,
      businessId: input.businessId,
      productId: input.productId,
      userId: input.userId,
    };

    const [listResult, summary, filterLines] = await Promise.all([
      this.purchasesReportRepository.findAll(
        filters,
        1,
        EXPORT_ROW_LIMIT,
        'date',
        'desc',
      ),
      this.purchasesReportRepository.getSummary(filters),
      this.resolveFilterLines(input),
    ]);

    const rows = listResult.items.map((item) => [
      formatReportDate(item.purchaseDate),
      item.purchaseNumber,
      item.supplierName,
      item.username,
      formatReportQuantity(item.itemCount),
      formatReportCurrency(item.total),
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE COMPRAS',
      periodLabel: formatReportPeriodLabel(startDate, endDate),
      filters: filterLines,
      summary: [
        {
          label: 'Total comprado',
          value: formatReportCurrency(summary.totalAmount),
        },
        {
          label: 'Cantidad de compras',
          value: formatReportQuantity(summary.purchasesCount),
        },
        {
          label: 'Productos comprados',
          value: formatReportQuantity(summary.unitsPurchased),
        },
        {
          label: 'Promedio por compra',
          value: formatReportCurrency(summary.averagePurchase),
        },
      ],
      columns: [
        { header: 'Fecha', width: 60 },
        { header: 'Compra', width: 80 },
        { header: 'Proveedor', width: 110 },
        { header: 'Usuario', width: 90 },
        { header: 'Productos', width: 55, align: 'right' },
        { header: 'Total', width: 80, align: 'right' },
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

  private async resolveFilterLines(
    input: ExportPurchasesReportPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];

    if (input.supplierId) {
      const supplier = await this.supplierRepository.findById(input.supplierId);
      lines.push({ label: 'Proveedor', value: supplier?.name ?? '—' });
    }
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

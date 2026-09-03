import { Inject, Injectable } from '@nestjs/common';
import { GetIceCreamSalesReportUseCase } from './get-ice-cream-sales-report.use-case';
import { GetIceCreamPurchasesReportUseCase } from './get-ice-cream-purchases-report.use-case';
import { GetIceCreamSalesReportSummaryUseCase } from './get-ice-cream-sales-report-summary.use-case';
import { GetIceCreamPurchasesReportSummaryUseCase } from './get-ice-cream-purchases-report-summary.use-case';
import { ICE_CREAM_REPOSITORY } from '../../../ice-creams/domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../../ice-creams/domain/repositories/ice-cream.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { NoIceCreamMovementTypeSelectedError } from '../../domain/errors/no-ice-cream-movement-type-selected.error';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  formatReportCurrency,
  formatReportPeriodLabel,
  formatReportQuantity,
} from '../utils/report-format.util';
import { IceCreamReportType } from '../dtos/ice-cream-report-output';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportIceCreamReportPdfInput {
  types?: IceCreamReportType[];
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  userId?: string;
  generatedByUsername: string;
}

/** Same cap and reasoning as every other report export in this module. */
const EXPORT_ROW_LIMIT = 500;

const TYPE_LABEL: Record<IceCreamReportType, string> = {
  sales: 'Venta',
  purchases: 'Compra',
};

/** Title varies by selection, per the ticket's explicit requirement. */
function reportTitle(types: IceCreamReportType[]): string {
  const wantsSales = types.includes('sales');
  const wantsPurchases = types.includes('purchases');
  if (wantsSales && wantsPurchases) {
    return 'REPORTE GENERAL DE HELADERÍA';
  }
  if (wantsSales) {
    return 'REPORTE DE VENTAS DE HELADERÍA';
  }
  return 'REPORTE DE COMPRAS DE HELADERÍA';
}

@Injectable()
export class ExportIceCreamReportPdfUseCase {
  constructor(
    private readonly getIceCreamSalesReportUseCase: GetIceCreamSalesReportUseCase,
    private readonly getIceCreamPurchasesReportUseCase: GetIceCreamPurchasesReportUseCase,
    private readonly getIceCreamSalesReportSummaryUseCase: GetIceCreamSalesReportSummaryUseCase,
    private readonly getIceCreamPurchasesReportSummaryUseCase: GetIceCreamPurchasesReportSummaryUseCase,
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ExportIceCreamReportPdfInput): Promise<Buffer> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoIceCreamMovementTypeSelectedError();
    }

    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const wantsSales = types.includes('sales');
    const wantsPurchases = types.includes('purchases');
    const showTypeColumn = wantsSales && wantsPurchases;

    const listInput = {
      startDate: input.startDate,
      endDate: input.endDate,
      iceCreamId: input.iceCreamId,
      userId: input.userId,
      page: 1,
      limit: EXPORT_ROW_LIMIT,
    };

    const [
      salesResult,
      purchasesResult,
      salesSummary,
      purchasesSummary,
      filterLines,
    ] = await Promise.all([
      wantsSales
        ? this.getIceCreamSalesReportUseCase.execute(listInput)
        : Promise.resolve({ items: [], total: 0 }),
      wantsPurchases
        ? this.getIceCreamPurchasesReportUseCase.execute(listInput)
        : Promise.resolve({ items: [], total: 0 }),
      wantsSales
        ? this.getIceCreamSalesReportSummaryUseCase.execute(input)
        : Promise.resolve({
            totalSold: 0,
            totalQuantity: 0,
            recordCount: 0,
            averagePrice: 0,
          }),
      wantsPurchases
        ? this.getIceCreamPurchasesReportSummaryUseCase.execute(input)
        : Promise.resolve({
            totalPurchased: 0,
            totalQuantity: 0,
            recordCount: 0,
            averageCost: 0,
          }),
      this.resolveFilterLines(input, types),
    ]);

    const merged = [
      ...salesResult.items.map((item) => ({
        type: 'sales' as const,
        date: item.date,
        product: item.product,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        username: item.username,
      })),
      ...purchasesResult.items.map((item) => ({
        type: 'purchases' as const,
        date: item.date,
        product: item.product,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.costPrice,
        total: item.total,
        username: item.username,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const totalMatching = salesResult.total + purchasesResult.total;
    const limited = merged.slice(0, EXPORT_ROW_LIMIT);

    const rows = limited.map((item) => {
      const base = [
        new Date(item.date).toLocaleDateString('es-GT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        item.product,
        item.sku,
        formatReportQuantity(item.quantity),
        formatReportCurrency(item.unitPrice),
        formatReportCurrency(item.total),
        item.username,
      ];
      return showTypeColumn ? [TYPE_LABEL[item.type], ...base] : base;
    });

    const difference = salesSummary.totalSold - purchasesSummary.totalPurchased;
    const summaryTiles = [
      ...(wantsSales
        ? [
            {
              label: 'Total de Ventas',
              value: formatReportCurrency(salesSummary.totalSold),
            },
          ]
        : []),
      ...(wantsPurchases
        ? [
            {
              label: 'Total de Compras',
              value: formatReportCurrency(purchasesSummary.totalPurchased),
            },
          ]
        : []),
      ...(showTypeColumn
        ? [{ label: 'Diferencia', value: formatReportCurrency(difference) }]
        : []),
      {
        label: 'Total de Movimientos',
        value: formatReportQuantity(
          salesSummary.recordCount + purchasesSummary.recordCount,
        ),
      },
    ];

    const baseColumns = [
      { header: 'Fecha', width: 55 },
      { header: 'Producto', width: 95 },
      { header: 'SKU', width: 60 },
      { header: 'Cant.', width: 35, align: 'right' as const },
      { header: 'Precio Unitario', width: 70, align: 'right' as const },
      { header: 'Total', width: 60, align: 'right' as const },
      { header: 'Usuario', width: 60 },
    ];
    const columns = showTypeColumn
      ? [{ header: 'Tipo', width: 50 }, ...baseColumns]
      : baseColumns;

    return buildReportPdf({
      reportTitle: reportTitle(types),
      periodLabel: formatReportPeriodLabel(startDate, endDate),
      filters: filterLines,
      summary: summaryTiles,
      columns,
      rows,
      generatedAt: new Date(),
      generatedByUsername: input.generatedByUsername,
      truncationNotice:
        totalMatching > EXPORT_ROW_LIMIT
          ? `Se muestran los primeros ${EXPORT_ROW_LIMIT} de ${totalMatching} registros encontrados. Aplica filtros más específicos para exportar el detalle completo.`
          : undefined,
    });
  }

  private async resolveFilterLines(
    input: ExportIceCreamReportPdfInput,
    types: IceCreamReportType[],
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [
      {
        label: 'Tipo',
        value: types
          .map((t) => (t === 'sales' ? 'Ventas' : 'Compras'))
          .join(', '),
      },
    ];

    if (input.iceCreamId) {
      const iceCream = await this.iceCreamRepository.findById(input.iceCreamId);
      lines.push({
        label: 'Producto',
        value: iceCream ? `${iceCream.sku} — ${iceCream.product}` : '—',
      });
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

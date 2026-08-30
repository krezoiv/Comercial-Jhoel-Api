import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_TYPE_REPOSITORY } from '../../../recharges/domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../../recharges/domain/repositories/recharge-type.repository';
import { InvalidRechargeDateRangeError } from '../../../recharges/domain/errors/invalid-recharge-date-range.error';
import { formatReportCurrency, formatReportQuantity } from '../utils/report-format.util';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportRechargesReportPdfInput {
  startDate?: string;
  endDate?: string;
  rechargeTypeId?: string;
  generatedByUsername: string;
}

/** Same cap and same reasoning as `ExportSalesReportPdfUseCase`/`ExportPurchasesReportPdfUseCase` — an unbounded date range shouldn't produce an unbounded PDF; the web view still paginates through everything. */
const EXPORT_ROW_LIMIT = 500;

/** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — no `Date` object round-trip, avoiding any timezone-parsing risk for a value that's already an unambiguous calendar day. */
function formatRechargeDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatRechargePeriodLabel(
  startDate?: string,
  endDate?: string,
): string {
  if (!startDate && !endDate) {
    return 'Todas las fechas';
  }
  if (startDate && endDate) {
    return `${formatRechargeDate(startDate)} - ${formatRechargeDate(endDate)}`;
  }
  if (startDate) {
    return `Desde ${formatRechargeDate(startDate)}`;
  }
  return `Hasta ${formatRechargeDate(endDate as string)}`;
}

@Injectable()
export class ExportRechargesReportPdfUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
  ) {}

  async execute(input: ExportRechargesReportPdfInput): Promise<Buffer> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidRechargeDateRangeError();
    }

    const filters = {
      startDate: input.startDate,
      endDate: input.endDate,
      rechargeTypeId: input.rechargeTypeId,
    };

    // Same filters drive the list and the summary here as every other
    // export in this module — the PDF can never show a total that doesn't
    // match the rows printed under it.
    const [listResult, summary, filterLines] = await Promise.all([
      this.dailyBalanceRepository.findHistory({
        ...filters,
        page: 1,
        limit: EXPORT_ROW_LIMIT,
      }),
      this.dailyBalanceRepository.getReportSummary(filters),
      this.resolveFilterLines(input),
    ]);

    const rows = listResult.items.map((item) => [
      formatRechargeDate(item.date),
      item.rechargeTypeName,
      formatReportCurrency(item.previousBalance),
      formatReportCurrency(item.totalPurchases),
      formatReportCurrency(item.dailyBalance),
      item.finalBalance !== null
        ? formatReportCurrency(item.finalBalance)
        : '—',
      item.sale !== null ? formatReportCurrency(item.sale) : '—',
      item.createdByUsername,
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE RECARGAS ELECTRÓNICAS',
      periodLabel: formatRechargePeriodLabel(input.startDate, input.endDate),
      filters: filterLines,
      summary: [
        {
          label: 'Total comprado',
          value: formatReportCurrency(summary.totalPurchases),
        },
        {
          label: 'Total vendido',
          value: formatReportCurrency(summary.totalSales),
        },
        { label: 'Registros', value: formatReportQuantity(summary.recordCount) },
        {
          label: 'Promedio de venta',
          value: formatReportCurrency(
            summary.closedCount > 0
              ? summary.totalSales / summary.closedCount
              : 0,
          ),
        },
      ],
      columns: [
        { header: 'Fecha', width: 55 },
        { header: 'Tipo', width: 45 },
        { header: 'Saldo Anterior', width: 65, align: 'right' },
        { header: 'Compra', width: 60, align: 'right' },
        { header: 'Saldo del Día', width: 65, align: 'right' },
        { header: 'Saldo Final', width: 60, align: 'right' },
        { header: 'Venta', width: 60, align: 'right' },
        { header: 'Usuario', width: 65 },
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

  /** Resolves the type id filter to its display name — a PDF showing a raw UUID would be useless to a reader. */
  private async resolveFilterLines(
    input: ExportRechargesReportPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];

    if (input.rechargeTypeId) {
      const type = await this.rechargeTypeRepository.findById(
        input.rechargeTypeId,
      );
      lines.push({ label: 'Tipo de recarga', value: type?.name ?? '—' });
    }

    return lines;
  }
}

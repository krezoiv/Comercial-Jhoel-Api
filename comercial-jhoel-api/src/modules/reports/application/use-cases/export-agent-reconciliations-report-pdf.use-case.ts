import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATIONS_REPORT_REPOSITORY } from '../../domain/repositories/agent-reconciliations-report.repository';
import type { AgentReconciliationsReportRepository } from '../../domain/repositories/agent-reconciliations-report.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import {
  formatReportCurrency,
  formatReportQuantity,
} from '../utils/report-format.util';
import { buildReportPdf } from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportAgentReconciliationsReportPdfInput {
  startDate?: string;
  endDate?: string;
  generatedByUsername: string;
}

/** Same cap and reasoning as every other export in this module — an unbounded date range shouldn't produce an unbounded PDF. */
const EXPORT_ROW_LIMIT = 500;

/** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing — same technique as `ExportRechargesReportPdfUseCase`, no `Date` round-trip needed for an unambiguous calendar day. */
function formatReconciliationDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatReconciliationPeriodLabel(
  startDate?: string,
  endDate?: string,
): string {
  if (!startDate && !endDate) {
    return 'Todas las fechas';
  }
  if (startDate && endDate) {
    return `${formatReconciliationDate(startDate)} - ${formatReconciliationDate(endDate)}`;
  }
  if (startDate) {
    return `Desde ${formatReconciliationDate(startDate)}`;
  }
  return `Hasta ${formatReconciliationDate(endDate as string)}`;
}

@Injectable()
export class ExportAgentReconciliationsReportPdfUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY)
    private readonly repository: AgentReconciliationsReportRepository,
  ) {}

  async execute(
    input: ExportAgentReconciliationsReportPdfInput,
  ): Promise<Buffer> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const filters = { startDate: input.startDate, endDate: input.endDate };

    const [listResult, summary] = await Promise.all([
      this.repository.findAll(filters, 1, EXPORT_ROW_LIMIT),
      this.repository.getSummary(filters),
    ]);

    const rows = listResult.items.map((item) => [
      formatReconciliationDate(item.date),
      formatReportCurrency(item.totalCash),
      formatReportCurrency(item.totalBanks),
      formatReportCurrency(item.totalAssets),
      formatReportCurrency(item.totalAccountsReceivable),
      formatReportCurrency(item.result),
      item.createdByUsername,
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE CUADRE DE AGENTES',
      periodLabel: formatReconciliationPeriodLabel(
        input.startDate,
        input.endDate,
      ),
      filters: [],
      summary: [
        {
          label: 'Total efectivo',
          value: formatReportCurrency(summary.totalCash),
        },
        {
          label: 'Total bancos',
          value: formatReportCurrency(summary.totalBanks),
        },
        {
          label: 'Registros',
          value: formatReportQuantity(summary.recordCount),
        },
        {
          label: 'Resultado promedio',
          value: formatReportCurrency(summary.averageResult),
        },
      ],
      columns: [
        { header: 'Fecha', width: 55 },
        { header: 'Efectivo', width: 60, align: 'right' },
        { header: 'Bancos', width: 60, align: 'right' },
        { header: 'Activos', width: 60, align: 'right' },
        { header: 'CxC', width: 60, align: 'right' },
        { header: 'Resultado', width: 65, align: 'right' },
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
}

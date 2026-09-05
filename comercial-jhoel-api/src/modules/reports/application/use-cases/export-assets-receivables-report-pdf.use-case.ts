import { Inject, Injectable } from '@nestjs/common';
import { ListAccountsReceivableUseCase } from '../../../accounts-receivable/application/use-cases/list-accounts-receivable.use-case';
import { ListAssetsUseCase } from '../../../assets/application/use-cases/list-assets.use-case';
import { GetAssetsReportSummaryUseCase } from './get-assets-report-summary.use-case';
import { GetAccountsReceivableReportSummaryUseCase } from './get-accounts-receivable-report-summary.use-case';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import { NoReportTypeSelectedError } from '../../domain/errors/no-report-type-selected.error';
import {
  formatReportCurrency,
  formatReportQuantity,
} from '../utils/report-format.util';
import {
  ReportStatusFilter,
  parseReportStatus,
} from '../utils/parse-report-status';
import { AssetsReceivablesReportType } from '../dtos/assets-receivables-report-output';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportAssetsReceivablesReportPdfInput {
  types?: AssetsReceivablesReportType[];
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatusFilter;
  search?: string;
  generatedByUsername: string;
}

/** Same cap and reasoning as every other report export in this module. */
const EXPORT_ROW_LIMIT = 500;

function formatRecordDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatPeriodLabel(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) {
    return 'Todas las fechas';
  }
  if (startDate && endDate) {
    return `${formatRecordDate(startDate)} - ${formatRecordDate(endDate)}`;
  }
  if (startDate) {
    return `Desde ${formatRecordDate(startDate)}`;
  }
  return `Hasta ${formatRecordDate(endDate as string)}`;
}

const STATUS_LABEL: Record<ReportStatusFilter, string> = {
  all: 'Todos',
  active: 'Activos',
  inactive: 'Inactivos',
};

const TYPE_LABEL: Record<AssetsReceivablesReportType, string> = {
  assets: 'Activo',
  accounts_receivable: 'Cuenta por Cobrar',
};

/** Title varies by selection, per the ticket's explicit requirement. */
function reportTitle(types: AssetsReceivablesReportType[]): string {
  const wantsAssets = types.includes('assets');
  const wantsReceivables = types.includes('accounts_receivable');
  if (wantsAssets && wantsReceivables) {
    return 'REPORTE DE ACTIVOS Y CUENTAS POR COBRAR';
  }
  if (wantsAssets) {
    return 'REPORTE DE ACTIVOS';
  }
  return 'REPORTE DE CUENTAS POR COBRAR';
}

@Injectable()
export class ExportAssetsReceivablesReportPdfUseCase {
  constructor(
    private readonly listAssetsUseCase: ListAssetsUseCase,
    private readonly listAccountsReceivableUseCase: ListAccountsReceivableUseCase,
    private readonly getAssetsReportSummaryUseCase: GetAssetsReportSummaryUseCase,
    private readonly getAccountsReceivableReportSummaryUseCase: GetAccountsReceivableReportSummaryUseCase,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: ExportAssetsReceivablesReportPdfInput): Promise<Buffer> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoReportTypeSelectedError();
    }
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const isActive = parseReportStatus(input.status);
    const wantsAssets = types.includes('assets');
    const wantsReceivables = types.includes('accounts_receivable');
    const showTypeColumn = wantsAssets && wantsReceivables;

    const listInput = {
      clientId: input.clientId,
      dateFrom: input.startDate,
      dateTo: input.endDate,
      isActive,
      search: input.search,
      page: 1,
      limit: EXPORT_ROW_LIMIT,
    };

    const [
      assetsResult,
      receivablesResult,
      assetsSummary,
      receivablesSummary,
      filterLines,
    ] = await Promise.all([
      wantsAssets
        ? this.listAssetsUseCase.execute(listInput)
        : Promise.resolve({ items: [], total: 0 }),
      wantsReceivables
        ? this.listAccountsReceivableUseCase.execute(listInput)
        : Promise.resolve({ items: [], total: 0 }),
      wantsAssets
        ? this.getAssetsReportSummaryUseCase.execute(input)
        : Promise.resolve({ recordCount: 0, totalAmount: 0 }),
      wantsReceivables
        ? this.getAccountsReceivableReportSummaryUseCase.execute(input)
        : Promise.resolve({ recordCount: 0, totalAmount: 0 }),
      this.resolveFilterLines(input, types),
    ]);

    const merged = [
      ...assetsResult.items.map((item) => ({
        ...item,
        type: 'assets' as const,
      })),
      ...receivablesResult.items.map((item) => ({
        ...item,
        type: 'accounts_receivable' as const,
      })),
    ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const totalMatching = assetsResult.total + receivablesResult.total;
    const limited = merged.slice(0, EXPORT_ROW_LIMIT);

    const rows = limited.map((item) => {
      // `amount` is always a positive magnitude now (see migration
      // `CreateFinancialKardexColumns`) — prefixing an ABONO with "-"
      // restores the same negative-amount visual this report showed for
      // Activos corrections before that migration split the sign into
      // `movementType`.
      const amountLabel =
        item.movementType === 'ABONO'
          ? `-${formatReportCurrency(item.amount)}`
          : formatReportCurrency(item.amount);
      const base = [
        item.clientName,
        formatRecordDate(item.date),
        amountLabel,
        item.description ?? '—',
        item.isActive ? 'Activo' : 'Inactivo',
      ];
      return showTypeColumn ? [TYPE_LABEL[item.type], ...base] : base;
    });

    const totalGeneral =
      assetsSummary.totalAmount + receivablesSummary.totalAmount;
    const summaryTiles = [
      ...(wantsAssets
        ? [
            {
              label: 'Total Activos',
              value: formatReportCurrency(assetsSummary.totalAmount),
            },
          ]
        : []),
      ...(wantsReceivables
        ? [
            {
              label: 'Total Cuentas por Cobrar',
              value: formatReportCurrency(receivablesSummary.totalAmount),
            },
          ]
        : []),
      ...(showTypeColumn
        ? [
            {
              label: 'Total General',
              value: formatReportCurrency(totalGeneral),
            },
          ]
        : []),
      {
        label: 'Total de Registros',
        value: formatReportQuantity(
          assetsSummary.recordCount + receivablesSummary.recordCount,
        ),
      },
    ];

    const baseColumns = [
      { header: 'Cliente', width: 100 },
      { header: 'Fecha', width: 55 },
      { header: 'Monto', width: 65, align: 'right' as const },
      { header: 'Descripción', width: 125 },
      { header: 'Estado', width: 50 },
    ];
    const columns = showTypeColumn
      ? [{ header: 'Tipo', width: 75 }, ...baseColumns]
      : baseColumns;

    return buildReportPdf({
      reportTitle: reportTitle(types),
      periodLabel: formatPeriodLabel(input.startDate, input.endDate),
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
    input: ExportAssetsReceivablesReportPdfInput,
    types: AssetsReceivablesReportType[],
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [
      { label: 'Tipo', value: types.map((t) => TYPE_LABEL[t]).join(', ') },
    ];

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      lines.push({ label: 'Cliente', value: client?.name ?? '—' });
    }

    lines.push({ label: 'Estado', value: STATUS_LABEL[input.status ?? 'all'] });

    if (input.search) {
      lines.push({ label: 'Búsqueda', value: input.search });
    }

    return lines;
  }
}

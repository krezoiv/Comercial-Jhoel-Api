import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../../banks/domain/repositories/bank.repository';
import type { BankRepository } from '../../../banks/domain/repositories/bank.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import {
  formatReportCurrency,
  formatReportQuantity,
} from '../utils/report-format.util';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';
import {
  BankTransfersReportInput,
  GetBankTransfersReportSummaryUseCase,
  GetBankTransfersReportUseCase,
} from './get-bank-transfers-report.use-case';

export interface ExportBankTransfersReportPdfInput extends BankTransfersReportInput {
  generatedByUsername: string;
}

const EXPORT_ROW_LIMIT = 500;

function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatPeriod(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return 'Todas las fechas';
  if (startDate && endDate)
    return `${formatIsoDate(startDate)} - ${formatIsoDate(endDate)}`;
  if (startDate) return `Desde ${formatIsoDate(startDate)}`;
  return `Hasta ${formatIsoDate(endDate as string)}`;
}

/** PDF del Reporte de Transferencias — mismo `buildReportPdf` y tope de filas que el resto de la Reportería. */
@Injectable()
export class ExportBankTransfersReportPdfUseCase {
  constructor(
    private readonly getBankTransfersReportUseCase: GetBankTransfersReportUseCase,
    private readonly getBankTransfersReportSummaryUseCase: GetBankTransfersReportSummaryUseCase,
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ExportBankTransfersReportPdfInput): Promise<Buffer> {
    const [page, summary, filterLines] = await Promise.all([
      this.getBankTransfersReportUseCase.execute({
        ...input,
        page: 1,
        limit: EXPORT_ROW_LIMIT,
      }),
      this.getBankTransfersReportSummaryUseCase.execute(input),
      this.resolveFilterLines(input),
    ]);

    const rows = page.items.map((transfer) => [
      formatIsoDate(transfer.businessDate),
      `${transfer.source.bankName} · ${transfer.source.accountNumber}`,
      transfer.destination
        ? `${transfer.destination.bankName} · ${transfer.destination.accountNumber}`
        : 'Retiro de efectivo en banco',
      formatReportCurrency(transfer.amount),
      transfer.referenceText ?? transfer.concept ?? '—',
      transfer.username,
      transfer.status === 'ANULADO' ? 'Anulada' : 'Aplicada',
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE TRANSFERENCIAS BANCARIAS',
      periodLabel: formatPeriod(input.startDate, input.endDate),
      filters: filterLines,
      summary: [
        {
          label: 'Transferencias',
          value: formatReportQuantity(summary.transferCount),
        },
        {
          label: 'Monto transferido',
          value: formatReportCurrency(summary.totalAmount),
        },
        { label: 'Anuladas', value: formatReportQuantity(summary.voidedCount) },
      ],
      columns: [
        { header: 'Fecha', width: 56 },
        { header: 'Origen', width: 108 },
        { header: 'Destino', width: 108 },
        { header: 'Monto', width: 70, align: 'right' },
        { header: 'Referencia', width: 70 },
        { header: 'Usuario', width: 58 },
        { header: 'Estado', width: 50 },
      ],
      rows,
      generatedAt: new Date(),
      generatedByUsername: input.generatedByUsername,
      truncationNotice:
        page.total > EXPORT_ROW_LIMIT
          ? `Se muestran las primeras ${EXPORT_ROW_LIMIT} de ${page.total} transferencias. Aplica un rango de fechas más específico para exportar el detalle completo.`
          : undefined,
    });
  }

  private async resolveFilterLines(
    input: BankTransfersReportInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];
    const accountLabel = async (id: string) => {
      const bank = await this.bankRepository.findById(id);
      return bank ? `${bank.name} · ${bank.accountNumber}` : '—';
    };
    if (input.sourceBankId) {
      lines.push({
        label: 'Cuenta origen',
        value: await accountLabel(input.sourceBankId),
      });
    }
    if (input.destinationBankId) {
      lines.push({
        label: 'Cuenta destino',
        value: await accountLabel(input.destinationBankId),
      });
    }
    if (input.userId) {
      const user = await this.userRepository.findById(input.userId);
      lines.push({
        label: 'Usuario',
        value: user?.username ?? user?.name ?? '—',
      });
    }
    if (input.kind) {
      lines.push({
        label: 'Tipo',
        value:
          input.kind === 'CASH_WITHDRAWAL'
            ? 'Retiros de efectivo en banco'
            : 'Transferencias entre cuentas',
      });
    }
    if (input.status) {
      lines.push({
        label: 'Estado',
        value: input.status === 'ANULADO' ? 'Anuladas' : 'Aplicadas',
      });
    }
    return lines;
  }
}

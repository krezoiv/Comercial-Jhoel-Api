import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../../bank-deposits/domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../../bank-deposits/domain/repositories/bank-deposit.repository';
import { TRANSACTION_BANK_REPOSITORY } from '../../../transaction-banks/domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../../transaction-banks/domain/repositories/transaction-bank.repository';
import { TRANSACTION_TYPE_REPOSITORY } from '../../../transaction-types/domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../../transaction-types/domain/repositories/transaction-type.repository';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { InvalidBankDepositDateRangeError } from '../../../bank-deposits/domain/errors/invalid-bank-deposit-date-range.error';
import {
  formatReportCurrency,
  formatReportQuantity,
} from '../utils/report-format.util';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportBankDepositsReportPdfInput {
  startDate?: string;
  endDate?: string;
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
  generatedByUsername: string;
}

/** Same cap and reasoning as every other export in this module — an unbounded date range shouldn't produce an unbounded PDF. */
const EXPORT_ROW_LIMIT = 500;

/** `yyyy-MM-dd` → `dd/MM/yyyy` via plain string slicing, same as `formatRechargeDate` — `operationDate` is already an unambiguous calendar day, no `Date` round-trip needed. */
function formatBankDepositDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/** `dd/MM/yyyy HH:mm` in server-local time — `createdAt` is the real instant the deposit was registered, down to the minute, unlike `operationDate` (a plain business day with no time component). */
function formatBankDepositDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatBankDepositPeriodLabel(
  startDate?: string,
  endDate?: string,
): string {
  if (!startDate && !endDate) {
    return 'Todas las fechas';
  }
  if (startDate && endDate) {
    return `${formatBankDepositDate(startDate)} - ${formatBankDepositDate(endDate)}`;
  }
  if (startDate) {
    return `Desde ${formatBankDepositDate(startDate)}`;
  }
  return `Hasta ${formatBankDepositDate(endDate as string)}`;
}

@Injectable()
export class ExportBankDepositsReportPdfUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ExportBankDepositsReportPdfInput): Promise<Buffer> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankDepositDateRangeError();
    }

    const filters = {
      startDate: input.startDate,
      endDate: input.endDate,
      transactionBankId: input.transactionBankId,
      transactionTypeId: input.transactionTypeId,
      userId: input.userId,
    };

    // Same filters drive the list and the summary here as every other export in this module.
    const [listResult, summary, filterLines] = await Promise.all([
      this.bankDepositRepository.findAll({
        ...filters,
        page: 1,
        limit: EXPORT_ROW_LIMIT,
      }),
      this.bankDepositRepository.getReportSummary(filters),
      this.resolveFilterLines(input),
    ]);

    const rows = listResult.items.map((item) => [
      formatBankDepositDateTime(item.createdAt),
      item.transactionBankName,
      item.transactionTypeName,
      item.clientName ?? '—',
      formatReportCurrency(item.totalAmount),
      formatReportQuantity(item.transactionCount),
      item.username,
    ]);

    return buildReportPdf({
      reportTitle: 'REPORTE DE TRANSACCIONES',
      periodLabel: formatBankDepositPeriodLabel(input.startDate, input.endDate),
      filters: filterLines,
      summary: [
        {
          label: 'Operaciones',
          value: formatReportQuantity(summary.operationCount),
        },
        {
          label: 'Transacciones',
          value: formatReportQuantity(summary.transactionCount),
        },
        {
          label: 'Monto total',
          value: formatReportCurrency(summary.totalAmount),
        },
      ],
      columns: [
        { header: 'Fecha y Hora', width: 75 },
        { header: 'Banco Agente', width: 85 },
        { header: 'Tipo', width: 75 },
        { header: 'Cliente', width: 75 },
        { header: 'Monto Total', width: 75, align: 'right' },
        { header: 'Transacciones', width: 70, align: 'right' },
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

  /** Resolves id filters to their display names — a PDF showing a raw UUID would be useless to a reader. */
  private async resolveFilterLines(
    input: ExportBankDepositsReportPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];

    if (input.transactionBankId) {
      const bank = await this.transactionBankRepository.findById(
        input.transactionBankId,
      );
      lines.push({ label: 'Banco agente', value: bank?.name ?? '—' });
    }

    if (input.transactionTypeId) {
      const type = await this.transactionTypeRepository.findById(
        input.transactionTypeId,
      );
      lines.push({ label: 'Tipo de transacción', value: type?.name ?? '—' });
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

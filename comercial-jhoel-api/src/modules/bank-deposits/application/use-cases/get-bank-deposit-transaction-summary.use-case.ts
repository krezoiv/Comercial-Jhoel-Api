import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { todayIsoDate } from '../utils/today-iso-date';

export interface BankDepositSummaryByBank {
  transactionBankId: string;
  transactionBankName: string;
  transactions: number;
}

export interface BankDepositPeriodSummary {
  totalTransactions: number;
  byBank: BankDepositSummaryByBank[];
}

export interface BankDepositTransactionSummaryOutput {
  daily: BankDepositPeriodSummary;
  monthly: BankDepositPeriodSummary;
}

/** Local-time `yyyy-MM-dd` for the 1st of the current month — same technique `GetBankDepositMonthlyCountUseCase`/every other date-driven use case in this codebase already uses, never a UTC-offset dance. */
function firstDayOfMonthIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}-01`;
}

/**
 * Backs "Resumen Diario"/"Resumen del Mes en Curso" on Transaccionar, and
 * the "Resumen Diario de Transacciones" section on the Resumen dashboard —
 * both read this exact same endpoint/use case, per the ticket's own "no
 * quiero dos lógicas diferentes calculando lo mismo" requirement.
 *
 * Reuses `getReportSummary()` (already powers Reportería and the "Bancos"
 * monthly-count tile) rather than a new aggregate query — called twice,
 * once for today only and once for the 1st of the current month through
 * today. Both calls already exclude anuladas (`isVoided = false`, see that
 * method's own doc comment) and use the server's own `todayIsoDate()` (no
 * client-supplied date is ever accepted here), consistent with this
 * module's existing "no client-supplied date for anything but genuine
 * historical filters" posture.
 *
 * "Transacciones" here means `SUM(transaction_count)` — the same
 * "cantidad de transacciones" field the Transaccionar form itself already
 * asks for per registration — not the count of Transaccionar registrations
 * (`operationCount`). This mirrors `GetDashboardSummaryUseCase`'s own
 * "Transacciones Bancarias" indicator, which made the identical choice for
 * the identical reason (see that use case's doc comment) — not a new rule
 * invented here.
 */
@Injectable()
export class GetBankDepositTransactionSummaryUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositTransactionSummaryOutput> {
    const today = todayIsoDate();
    const monthStart = firstDayOfMonthIsoDate();

    const [dailySummary, monthlySummary] = await Promise.all([
      this.bankDepositRepository.getReportSummary({
        startDate: today,
        endDate: today,
      }),
      this.bankDepositRepository.getReportSummary({
        startDate: monthStart,
        endDate: today,
      }),
    ]);

    return {
      daily: {
        totalTransactions: dailySummary.transactionCount,
        byBank: dailySummary.byBank.map((row) => ({
          transactionBankId: row.transactionBankId,
          transactionBankName: row.transactionBankName,
          transactions: row.transactionCount,
        })),
      },
      monthly: {
        totalTransactions: monthlySummary.transactionCount,
        byBank: monthlySummary.byBank.map((row) => ({
          transactionBankId: row.transactionBankId,
          transactionBankName: row.transactionBankName,
          transactions: row.transactionCount,
        })),
      },
    };
  }
}

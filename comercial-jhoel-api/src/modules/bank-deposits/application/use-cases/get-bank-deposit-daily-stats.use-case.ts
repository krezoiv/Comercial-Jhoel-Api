import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';

export interface BankDepositDailyStatOutput {
  /** `yyyy-MM-dd` */
  date: string;
  transactionCount: number;
}

export interface BankDepositDailyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  /** One entry per calendar day of the current month, 1st through the last — a day with no non-voided operation is `transactionCount: 0`, never omitted. */
  days: BankDepositDailyStatOutput[];
}

/**
 * Backs the "Transacciones del mes" line chart on both Resumen and Reporte de
 * Transacciones — deliberately the one and only place this aggregation is
 * computed, so both charts are structurally guaranteed to agree (see this
 * module's other summary use cases — `GetBankDepositMonthlyCountUseCase`/
 * `GetBankDepositTransactionSummaryUseCase` — for the same "one endpoint, two
 * screens" precedent already established here).
 *
 * Always the server's own current month (`America/Guatemala`, see
 * `1759100000000-SetDatabaseTimezone`) — never a client-supplied date, same
 * "no confiar en el navegador para la fecha de negocio" posture as every
 * other date-driven use case in this module. `transactionCount` is
 * `SUM(transaction_count)` (subtransacciones), not a count of operations —
 * same distinction `GetBankDepositTransactionSummaryUseCase` already
 * documents — and excludes anuladas (`getDailyTransactionCounts` itself
 * filters `is_voided = false`).
 */
@Injectable()
export class GetBankDepositDailyStatsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositDailyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const startDate = `${monthPrefix}-01`;
    const endDate = `${monthPrefix}-${String(daysInMonth).padStart(2, '0')}`;

    const rows = await this.bankDepositRepository.getDailyTransactionCounts(
      startDate,
      endDate,
    );
    const countsByDate = new Map(rows.map((row) => [row.date, row.transactionCount]));

    const days: BankDepositDailyStatOutput[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      days.push({ date, transactionCount: countsByDate.get(date) ?? 0 });
    }

    return { month: monthPrefix, days };
  }
}

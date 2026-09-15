import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';

export interface BankDepositWeeklyStatOutput {
  weekNumber: number;
  /** "Semana N" */
  label: string;
  /** `yyyy-MM-dd` — first day of this week's bucket. */
  startDate: string;
  /** `yyyy-MM-dd` — last day of this week's bucket (the month's final bucket may be shorter than 7 days). */
  endDate: string;
  transactionCount: number;
}

export interface BankDepositWeeklyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  /** One entry per fixed 7-day window of the current month, día 1 en adelante — never omitted, even with 0 transacciones. */
  weeks: BankDepositWeeklyStatOutput[];
}

const DAYS_PER_WEEK_BUCKET = 7;

/**
 * "Transacciones por semana" — buckets the current month's days into fixed
 * 7-day windows starting at day 1 (día 1-7 = Semana 1, 8-14 = Semana 2,
 * ...), deliberately never ISO/calendar weeks — a calendar week can start
 * mid-month and spill into the next one, which would mix days from two
 * different months into one bucket. Fixed day-1-anchored windows make that
 * structurally impossible.
 *
 * Reuses the exact same `getDailyTransactionCounts()` call
 * `GetBankDepositDailyStatsUseCase` already makes — no new SQL grouping,
 * the already-aggregated, already-zero-filled day-level data is simply
 * re-bucketed here in memory. Always the server's own current month, same
 * "no confiar en el navegador para la fecha de negocio" posture as every
 * other date-driven use case in this module — resets automatically on the
 * 1st of the next month, no code change needed.
 */
@Injectable()
export class GetBankDepositWeeklyStatsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositWeeklyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const startDate = `${monthPrefix}-01`;
    const endDate = `${monthPrefix}-${String(daysInMonth).padStart(2, '0')}`;

    const rows = await this.bankDepositRepository.getDailyTransactionCounts(startDate, endDate);
    const countsByDate = new Map(rows.map((row) => [row.date, row.transactionCount]));

    const weeks: BankDepositWeeklyStatOutput[] = [];
    for (let startDay = 1; startDay <= daysInMonth; startDay += DAYS_PER_WEEK_BUCKET) {
      const endDay = Math.min(startDay + DAYS_PER_WEEK_BUCKET - 1, daysInMonth);
      let transactionCount = 0;
      for (let day = startDay; day <= endDay; day++) {
        const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
        transactionCount += countsByDate.get(date) ?? 0;
      }
      const weekNumber = weeks.length + 1;
      weeks.push({
        weekNumber,
        label: `Semana ${weekNumber}`,
        startDate: `${monthPrefix}-${String(startDay).padStart(2, '0')}`,
        endDate: `${monthPrefix}-${String(endDay).padStart(2, '0')}`,
        transactionCount,
      });
    }

    return { month: monthPrefix, weeks };
  }
}

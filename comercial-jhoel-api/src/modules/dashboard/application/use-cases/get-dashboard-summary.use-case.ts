import { Inject, Injectable } from '@nestjs/common';
import {
  DASHBOARD_REPOSITORY,
  DashboardPeriodRange,
} from '../../domain/repositories/dashboard.repository';
import type { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import {
  DashboardSummaryOutput,
  summarizeBankTransactions,
  summarizeDailySeries,
} from '../dtos/dashboard-summary-output';

/** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses (e.g. `todayIsoDate()` in bank-deposits/recharges). Never UTC: the API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * "Indicadores del mes" — the entire period is derived fresh on every call
 * from the server's own current date, never a stored value: `dayStart` is
 * always "the 1st of whatever month it is right now, 00:00:00 local", and
 * `dayEnd`/`isoEndDate` are always "right now". There is no month-rollover
 * job, counter, or reset to maintain — the moment the calendar turns over
 * to a new month, the very next call to this use case computes a
 * completely different `dayStart`, and every downstream query is scoped to
 * that new range automatically. Same reasoning already established for
 * `GetBankDepositMonthlyCountUseCase`'s own "Bancos" Resumen tile, applied
 * here to the fuller Ventas/Compras/Recargas/Transacciones set.
 */
@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async execute(): Promise<DashboardSummaryOutput> {
    const now = new Date();
    const period = this.buildPeriod(now);

    const raw = await this.dashboardRepository.getSummary(period);

    return {
      period: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        startDate: period.isoStartDate,
        endDate: period.isoEndDate,
      },
      rechargeSales: summarizeDailySeries(raw.rechargeSalesByDay),
      sales: summarizeDailySeries(raw.salesByDay),
      purchases: { total: raw.purchasesTotal },
      bankTransactions: summarizeBankTransactions(raw.bankTransactionsByBank),
    };
  }

  private buildPeriod(now: Date): DashboardPeriodRange {
    const firstOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    return {
      isoStartDate: toIsoDate(firstOfMonth),
      isoEndDate: toIsoDate(now),
      dayStart: firstOfMonth,
      dayEnd: endOfToday,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../../recharges/domain/repositories/recharge-daily-balance.repository';
import { InvalidRechargeDateRangeError } from '../../../recharges/domain/errors/invalid-recharge-date-range.error';
import { RechargesReportSummaryOutput } from '../dtos/recharges-report-output';

export interface GetRechargesReportSummaryInput {
  startDate?: string;
  endDate?: string;
  rechargeTypeId?: string;
}

/**
 * Unlike the daily-summary card (`GetRechargeSalesSummaryUseCase`, scoped to
 * one date's CURRENT cycle only), this aggregates across every cycle
 * matching the filters — a report over a date range needs the full
 * historical picture, not just "today". `date` is a plain DATE column, so
 * (like `GetRechargeHistoryUseCase`) a lexicographic string comparison for
 * the range check is already correct — no `parseReportDateRange`
 * start/end-of-day widening needed the way Sales/Purchases' `timestamptz`
 * columns require.
 */
@Injectable()
export class GetRechargesReportSummaryUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(
    input: GetRechargesReportSummaryInput,
  ): Promise<RechargesReportSummaryOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidRechargeDateRangeError();
    }

    const summary = await this.dailyBalanceRepository.getReportSummary({
      startDate: input.startDate,
      endDate: input.endDate,
      rechargeTypeId: input.rechargeTypeId,
    });

    return {
      ...summary,
      averageSale:
        summary.closedCount > 0 ? summary.totalSales / summary.closedCount : 0,
    };
  }
}

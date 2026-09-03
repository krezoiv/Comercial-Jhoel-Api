import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { InvalidRechargeDateRangeError } from '../../domain/errors/invalid-recharge-date-range.error';
import {
  RechargeDailyBalanceOutput,
  toRechargeDailyBalanceOutput,
} from '../dtos/recharge-daily-balance-output';

export interface GetRechargeHistoryInput {
  startDate?: string;
  endDate?: string;
  rechargeTypeId?: string;
  userId?: string;
  page?: number;
  limit?: number;
  /** See `FindRechargeHistoryOptions.excludeCancelledDays` — left `undefined`/`false` by the operational `GET /recharges/history` route, set `true` by Reportería's reuse of this use case. */
  excludeCancelledDays?: boolean;
}

export interface GetRechargeHistoryOutput {
  items: RechargeDailyBalanceOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class GetRechargeHistoryUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(
    input: GetRechargeHistoryInput,
  ): Promise<GetRechargeHistoryOutput> {
    // `date` is a plain DATE column, not timestamptz — unlike Reports'
    // sale/purchase date filters, a lexicographic `yyyy-MM-dd` string
    // comparison is already correct with no start/end-of-day widening
    // needed.
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidRechargeDateRangeError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.dailyBalanceRepository.findHistory({
      startDate: input.startDate,
      endDate: input.endDate,
      rechargeTypeId: input.rechargeTypeId,
      userId: input.userId,
      page,
      limit,
      excludeCancelledDays: input.excludeCancelledDays,
    });

    return {
      items: result.items.map(toRechargeDailyBalanceOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

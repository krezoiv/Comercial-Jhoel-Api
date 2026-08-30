import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_TYPE_REPOSITORY } from '../../domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargeDailyBalanceOutput,
  toRechargeDailyBalanceOutput,
} from '../dtos/recharge-daily-balance-output';

/**
 * "Al abrir el módulo" — defaults to today, computed server-side, but now
 * accepts an explicit `date` so the frontend's operation-date picker can
 * browse/backfill any past day. This is still what makes "saldo anterior"
 * fully automatic: for each active recharge type, the row for the given
 * date is fetched if it already exists, or lazily created (via
 * `ensure_recharge_daily_balance`) with `previousBalance` copied from the
 * most recent closed day — the user never types it in.
 */
@Injectable()
export class GetRechargeDailySummaryUseCase {
  constructor(
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(
    userId: string,
    date: string = todayIsoDate(),
  ): Promise<RechargeDailyBalanceOutput[]> {
    assertValidOperationDate(date);
    const types = await this.rechargeTypeRepository.findAll({
      activeOnly: true,
    });

    const balances = await Promise.all(
      types.map((type) =>
        this.dailyBalanceRepository.ensureDailyBalance(type.id, date, userId),
      ),
    );

    return balances.map(toRechargeDailyBalanceOutput);
  }
}

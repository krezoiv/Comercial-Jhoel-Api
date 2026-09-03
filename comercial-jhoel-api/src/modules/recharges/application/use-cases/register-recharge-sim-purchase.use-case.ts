import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_DAILY_STOCK_REPOSITORY } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import type { RechargeSimDailyStockRepository } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { assertRechargeDayWritable } from '../utils/assert-recharge-day-writable';
import {
  RechargeSimDailyStockOutput,
  toRechargeSimDailyStockOutput,
} from '../dtos/recharge-sim-daily-stock-output';

export interface RegisterRechargeSimPurchaseInput {
  simTypeId: string;
  quantity: number;
  userId: string;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

/**
 * Registers a physical SIM purchase — stock entry only. Reuses the exact
 * same day-lifecycle gate (`assertRechargeDayWritable`, backed by
 * `recharge_day_openings`) every other Recargas write use case already
 * uses, so "Gestión de Días de Recargas" opens/closes/reopens SIM
 * operations automatically alongside the electronic balance side, with no
 * new day-lifecycle code. Cost is never accepted here — the stored
 * function reads it from `recharge_sim_types` server-side.
 */
@Injectable()
export class RegisterRechargeSimPurchaseUseCase {
  constructor(
    @Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)
    private readonly dailyStockRepository: RechargeSimDailyStockRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(
    input: RegisterRechargeSimPurchaseInput,
  ): Promise<RechargeSimDailyStockOutput> {
    assertValidOperationDate(input.operationDate);
    await assertRechargeDayWritable(
      this.dayOpeningRepository,
      input.operationDate,
    );

    const stock = await this.dailyStockRepository.registerPurchase({
      simTypeId: input.simTypeId,
      date: input.operationDate,
      quantity: input.quantity,
      userId: input.userId,
    });

    return toRechargeSimDailyStockOutput(stock);
  }
}

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

export interface RegisterRechargeSimSaleInput {
  simTypeId: string;
  quantity: number;
  userId: string;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

/**
 * Registers a physical SIM sale — stock exit only, never touches the
 * electronic balance side. Same day-lifecycle gate as the purchase use
 * case. "Stock insuficiente" is enforced inside `register_recharge_sim_sale()`
 * under a row lock — this use case never pre-checks stock itself, the SQL
 * function is the real guarantee (same reasoning as `confirm_ice_cream_sale`).
 * Price is never accepted here — read from `recharge_sim_types` server-side.
 */
@Injectable()
export class RegisterRechargeSimSaleUseCase {
  constructor(
    @Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)
    private readonly dailyStockRepository: RechargeSimDailyStockRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(
    input: RegisterRechargeSimSaleInput,
  ): Promise<RechargeSimDailyStockOutput> {
    assertValidOperationDate(input.operationDate);
    await assertRechargeDayWritable(
      this.dayOpeningRepository,
      input.operationDate,
    );

    const stock = await this.dailyStockRepository.registerSale({
      simTypeId: input.simTypeId,
      date: input.operationDate,
      quantity: input.quantity,
      userId: input.userId,
    });

    return toRechargeSimDailyStockOutput(stock);
  }
}

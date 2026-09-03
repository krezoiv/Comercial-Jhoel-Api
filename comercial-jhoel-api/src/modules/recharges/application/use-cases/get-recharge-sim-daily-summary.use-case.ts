import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_TYPE_REPOSITORY } from '../../domain/repositories/recharge-sim-type.repository';
import type { RechargeSimTypeRepository } from '../../domain/repositories/recharge-sim-type.repository';
import { RECHARGE_SIM_DAILY_STOCK_REPOSITORY } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import type { RechargeSimDailyStockRepository } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargeSimDailyStockOutput,
  toRechargeSimDailyStockOutput,
} from '../dtos/recharge-sim-daily-stock-output';

/**
 * Mirrors `GetRechargeDailySummaryUseCase` exactly, for stock instead of a
 * cash balance: for each active SIM type, the row for the given date is
 * fetched if it already exists, or lazily created (`ensure_recharge_sim_daily_stock`)
 * with `previousStock` copied from the most recent prior day's `currentStock`.
 */
@Injectable()
export class GetRechargeSimDailySummaryUseCase {
  constructor(
    @Inject(RECHARGE_SIM_TYPE_REPOSITORY)
    private readonly simTypeRepository: RechargeSimTypeRepository,
    @Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)
    private readonly dailyStockRepository: RechargeSimDailyStockRepository,
  ) {}

  async execute(
    userId: string,
    date: string = todayIsoDate(),
  ): Promise<RechargeSimDailyStockOutput[]> {
    assertValidOperationDate(date);
    const types = await this.simTypeRepository.findAll({ activeOnly: true });

    const stocks = await Promise.all(
      types.map((type) =>
        this.dailyStockRepository.ensureDailyStock(type.id, date, userId),
      ),
    );

    return stocks.map(toRechargeSimDailyStockOutput);
  }
}

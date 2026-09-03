import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeCancelReasonRequiredError } from '../../domain/errors/recharge-day-reason-required.error';
import { GetRechargeDayDetailUseCase } from './get-recharge-day-detail.use-case';
import { RechargeDayDetailOutput } from '../dtos/recharge-day-detail-output';

export interface CancelRechargeDayInput {
  date: string;
  userId: string;
  reason: string;
}

/**
 * "Anular Día" — a soft delete of the whole cycle (see
 * `cancel_recharge_day`, SQL): never deletes `recharge_purchases`/
 * `recharge_sales`/`recharge_sales_closures`, only marks
 * `recharge_day_openings.is_cancelled`. Same division of responsibility
 * as `ReopenRechargeDayUseCase`: role already filtered by the guard, real
 * integrity validated atomically in the SQL function.
 */
@Injectable()
export class CancelRechargeDayUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    private readonly getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase,
  ) {}

  async execute(input: CancelRechargeDayInput): Promise<RechargeDayDetailOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new RechargeCancelReasonRequiredError();
    }

    await this.dayOpeningRepository.cancel(input.date, input.userId, reason);
    return this.getRechargeDayDetailUseCase.execute(input.date);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeReopenReasonRequiredError } from '../../domain/errors/recharge-day-reason-required.error';
import { GetRechargeDayDetailUseCase } from './get-recharge-day-detail.use-case';
import { RechargeDayDetailOutput } from '../dtos/recharge-day-detail-output';

export interface ReopenRechargeDayInput {
  date: string;
  userId: string;
  reason: string;
}

/**
 * "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already
 * happened in the controller's `RolesGuard`; the real status/cancellation/
 * later-day validation happens atomically inside `reopen_recharge_day`
 * (SQL, under the row lock) — this use case only orchestrates and
 * translates the result into the shape the frontend needs to refresh the
 * row/detail without a second call.
 */
@Injectable()
export class ReopenRechargeDayUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    private readonly getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase,
  ) {}

  async execute(input: ReopenRechargeDayInput): Promise<RechargeDayDetailOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new RechargeReopenReasonRequiredError();
    }

    await this.dayOpeningRepository.reopen(input.date, input.userId, reason);
    return this.getRechargeDayDetailUseCase.execute(input.date);
  }
}

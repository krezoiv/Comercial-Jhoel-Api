import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { ReopenReasonRequiredError } from '../../domain/errors/reason-required.error';
import { GetDayDetailUseCase } from './get-day-detail.use-case';
import { DayDetailOutput } from '../dtos/day-detail-output';

export interface ReopenDayInput {
  date: string;
  userId: string;
  reason: string;
}

/**
 * "Reabrir Día" — role validation (ADMIN/SUPER_ADMIN only) already
 * happened in the controller's `RolesGuard`; the real status/cancellation/
 * later-day validation happens atomically inside `reopen_agent_day` (SQL,
 * under the row lock) — this use case only orchestrates and translates
 * the result into the shape the frontend needs to refresh the row/detail
 * without a second call.
 */
@Injectable()
export class ReopenDayUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    private readonly getDayDetailUseCase: GetDayDetailUseCase,
  ) {}

  async execute(input: ReopenDayInput): Promise<DayDetailOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new ReopenReasonRequiredError();
    }

    await this.dayOpeningRepository.reopen(input.date, input.userId, reason);
    return this.getDayDetailUseCase.execute(input.date);
  }
}

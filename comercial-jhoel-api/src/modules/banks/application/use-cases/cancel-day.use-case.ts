import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { CancelReasonRequiredError } from '../../domain/errors/reason-required.error';
import { GetDayDetailUseCase } from './get-day-detail.use-case';
import { DayDetailOutput } from '../dtos/day-detail-output';

export interface CancelDayInput {
  date: string;
  userId: string;
  reason: string;
}

/**
 * "Anular Día" — a soft delete of the whole cycle (see `cancel_agent_day`,
 * SQL): never deletes `bank_balances`/`agent_reconciliations`, only marks
 * `day_openings.is_cancelled`. Same division of responsibility as
 * `ReopenDayUseCase`: role already filtered by the guard, real integrity
 * validated atomically in the SQL function.
 */
@Injectable()
export class CancelDayUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY) private readonly dayOpeningRepository: DayOpeningRepository,
    private readonly getDayDetailUseCase: GetDayDetailUseCase,
  ) {}

  async execute(input: CancelDayInput): Promise<DayDetailOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new CancelReasonRequiredError();
    }

    await this.dayOpeningRepository.cancel(input.date, input.userId, reason);
    return this.getDayDetailUseCase.execute(input.date);
  }
}

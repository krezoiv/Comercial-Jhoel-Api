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
 * "Anular Día" — soft delete del ciclo completo (ver `cancel_agent_day`,
 * SQL): nunca borra `bank_balances`/`agent_reconciliations`, solo marca
 * `day_openings.is_cancelled`. Misma división de responsabilidades que
 * `ReopenDayUseCase`: rol ya filtrado por el guard, integridad real
 * validada atómicamente en la función SQL.
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

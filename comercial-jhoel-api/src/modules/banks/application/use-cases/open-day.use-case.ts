import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { DAY_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/day-audit-log.repository';
import type { DayAuditLogRepository } from '../../domain/repositories/day-audit-log.repository';
import { InvalidBankBalanceDateError } from '../../domain/errors/invalid-bank-balance.error';
import { GetDayStatusUseCase } from './get-day-status.use-case';
import { DayStatusOutput } from '../dtos/day-status-output';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface OpenDayInput {
  date: string;
  userId: string;
}

/**
 * "Confirmar Apertura" — idempotent (`DayOpeningRepository.open` never
 * creates a second row for an already-opened date), so a double click or
 * a retry never fails or duplicates anything. Returns the day's full
 * status (not just "opened: yes"), so the frontend can update its UI in
 * one step without a second call.
 */
@Injectable()
export class OpenDayUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    @Inject(DAY_AUDIT_LOG_REPOSITORY)
    private readonly dayAuditLogRepository: DayAuditLogRepository,
    private readonly getDayStatusUseCase: GetDayStatusUseCase,
  ) {}

  async execute(input: OpenDayInput): Promise<DayStatusOutput> {
    if (!input.date || !DATE_PATTERN.test(input.date)) {
      throw new InvalidBankBalanceDateError();
    }

    // Only records 'OPENED' on the actual first opening — `open()` is
    // idempotent and a double click/retry must not duplicate the event
    // in the day's history.
    const existing = await this.dayOpeningRepository.findByDate(input.date);
    await this.dayOpeningRepository.open(input.date, input.userId);
    if (!existing) {
      await this.dayAuditLogRepository.record({
        date: input.date,
        action: 'OPENED',
        performedBy: input.userId,
        newStatus: 'OPENED',
      });
    }
    return this.getDayStatusUseCase.execute(input.date);
  }
}

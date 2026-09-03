import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RECHARGE_DAY_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/recharge-day-audit-log.repository';
import type { RechargeDayAuditLogRepository } from '../../domain/repositories/recharge-day-audit-log.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { GetRechargeDayStatusUseCase } from './get-recharge-day-status.use-case';
import { RechargeDayStatusOutput } from '../dtos/recharge-day-status-output';

export interface OpenRechargeDayInput {
  date: string;
  userId: string;
}

/**
 * "Confirmar Apertura" — idempotent (`RechargeDayOpeningRepository.open`
 * never creates a second row for an already-opened date), so a double
 * click or a retry never fails or duplicates anything. Returns the day's
 * full status (not just "opened: yes"), so the frontend can update its UI
 * in one step without a second call.
 */
@Injectable()
export class OpenRechargeDayUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    @Inject(RECHARGE_DAY_AUDIT_LOG_REPOSITORY)
    private readonly dayAuditLogRepository: RechargeDayAuditLogRepository,
    private readonly getRechargeDayStatusUseCase: GetRechargeDayStatusUseCase,
  ) {}

  async execute(input: OpenRechargeDayInput): Promise<RechargeDayStatusOutput> {
    assertValidOperationDate(input.date);

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
    return this.getRechargeDayStatusUseCase.execute(input.date);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RECHARGE_DAY_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/recharge-day-audit-log.repository';
import type { RechargeDayAuditLogRepository } from '../../domain/repositories/recharge-day-audit-log.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from '../../domain/repositories/recharge-sales-closure.repository';
import type { RechargeSalesClosureRepository } from '../../domain/repositories/recharge-sales-closure.repository';
import { RechargeDayNotFoundError } from '../../domain/errors/recharge-day-not-found.error';
import { toRechargeSalesClosureOutput } from '../dtos/recharge-sales-closure-output';
import { RechargeDayDetailOutput } from '../dtos/recharge-day-detail-output';

/**
 * "Ver Detalle" — composes reads from three repositories that already
 * exist (day, cuadre cycles, audit trail), never duplicates them. Only
 * applies to a date that was ever closed (`RechargeDayNotFoundError` if
 * no `recharge_day_openings` row ever existed for it) — a day still in
 * progress isn't this administrative module's responsibility. Returns
 * EVERY cuadre cycle saved that day (`findAllByDate`), not just the
 * latest — the direct consequence of Recargas' own multi-cycle-per-day
 * feature, unlike Banks' single-reconciliation detail.
 */
@Injectable()
export class GetRechargeDayDetailUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    @Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)
    private readonly salesClosureRepository: RechargeSalesClosureRepository,
    @Inject(RECHARGE_DAY_AUDIT_LOG_REPOSITORY)
    private readonly dayAuditLogRepository: RechargeDayAuditLogRepository,
  ) {}

  async execute(date: string): Promise<RechargeDayDetailOutput> {
    const dayOpening = await this.dayOpeningRepository.findByDate(date);
    if (!dayOpening) {
      throw new RechargeDayNotFoundError(date);
    }

    const [closures, auditLog] = await Promise.all([
      this.salesClosureRepository.findAllByDate(date),
      this.dayAuditLogRepository.findByDate(date),
    ]);

    const status = dayOpening.isCancelled ? 'CANCELLED' : dayOpening.isClosed ? 'CLOSED' : 'REOPENED';

    return {
      date: dayOpening.date,
      status,
      openedAt: dayOpening.openedAt,
      openedByUsername: dayOpening.openedByUsername,
      closedAt: dayOpening.closedAt,
      closedByUsername: dayOpening.closedBy ? dayOpening.closedByUsername : null,
      reopenedAt: dayOpening.reopenedAt,
      reopenedByUsername: dayOpening.reopenedBy ? dayOpening.reopenedByUsername : null,
      reopenReason: dayOpening.reopenReason,
      isCancelled: dayOpening.isCancelled,
      cancelledAt: dayOpening.cancelledAt,
      cancelledByUsername: dayOpening.cancelledBy ? dayOpening.cancelledByUsername : null,
      cancelReason: dayOpening.cancelReason,
      closures: closures.map(toRechargeSalesClosureOutput),
      auditLog: auditLog.map((entry) => ({
        id: entry.id,
        action: entry.action,
        performedByUsername: entry.performedByUsername,
        performedAt: entry.performedAt,
        reason: entry.reason,
        previousStatus: entry.previousStatus,
        newStatus: entry.newStatus,
      })),
    };
  }
}

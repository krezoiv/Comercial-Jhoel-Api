import { RechargeClosedDayStatus } from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeDayAuditAction } from '../../domain/entities/recharge-day-audit-log.entity';
import { RechargeSalesClosureOutput } from './recharge-sales-closure-output';

export interface RechargeDayAuditLogOutput {
  id: string;
  action: RechargeDayAuditAction;
  performedByUsername: string;
  performedAt: Date;
  reason: string | null;
  previousStatus: string | null;
  newStatus: string | null;
}

/**
 * "Ver Detalle" of a closed Recargas day — composes reads that already
 * exist in other use cases/repositories, never duplicates them. Unlike
 * Banks' own `DayDetailOutput` (a single `reconciliation`), `closures` is
 * an array covering EVERY cuadre cycle saved that day — the direct
 * consequence of this module's own multi-cycle-per-day feature, which
 * Banks has no equivalent of.
 */
export interface RechargeDayDetailOutput {
  date: string;
  status: RechargeClosedDayStatus;
  openedAt: Date;
  openedByUsername: string;
  closedAt: Date | null;
  closedByUsername: string | null;
  reopenedAt: Date | null;
  reopenedByUsername: string | null;
  reopenReason: string | null;
  isCancelled: boolean;
  cancelledAt: Date | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  closures: RechargeSalesClosureOutput[];
  auditLog: RechargeDayAuditLogOutput[];
}

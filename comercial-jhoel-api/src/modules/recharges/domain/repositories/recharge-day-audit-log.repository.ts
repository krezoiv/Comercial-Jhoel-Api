import {
  RechargeDayAuditAction,
  RechargeDayAuditLog,
} from '../entities/recharge-day-audit-log.entity';

export const RECHARGE_DAY_AUDIT_LOG_REPOSITORY = Symbol(
  'RECHARGE_DAY_AUDIT_LOG_REPOSITORY',
);

export interface CreateRechargeDayAuditLogData {
  date: string;
  action: RechargeDayAuditAction;
  performedBy: string;
  reason?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
}

export interface RechargeDayAuditLogRepository {
  /** Ascending chronological order — a day's history reads like a timeline. */
  findByDate(date: string): Promise<RechargeDayAuditLog[]>;
  /** Used only by `OpenRechargeDayUseCase` — closing/reopening/cancelling insert their own row inside the same SQL function (see the migration), never through this method. */
  record(data: CreateRechargeDayAuditLogData): Promise<RechargeDayAuditLog>;
}

import { DayAuditAction, DayAuditLog } from '../entities/day-audit-log.entity';

export const DAY_AUDIT_LOG_REPOSITORY = Symbol('DAY_AUDIT_LOG_REPOSITORY');

export interface CreateDayAuditLogData {
  date: string;
  action: DayAuditAction;
  performedBy: string;
  reason?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
}

export interface DayAuditLogRepository {
  /** Ascending chronological order — a day's history reads like a timeline. */
  findByDate(date: string): Promise<DayAuditLog[]>;
  /** Used only by `OpenDayUseCase` — reopening/closing/cancelling insert their own row inside the same SQL function (see the migration), never through this method. */
  record(data: CreateDayAuditLogData): Promise<DayAuditLog>;
}

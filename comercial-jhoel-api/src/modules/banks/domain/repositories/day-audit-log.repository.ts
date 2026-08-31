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
  /** Orden cronológico ascendente — el historial de un día se lee como una línea de tiempo. */
  findByDate(date: string): Promise<DayAuditLog[]>;
  /** Usado únicamente por `OpenDayUseCase` — reapertura/cierre/anulación insertan su propia fila dentro de la misma función SQL (ver la migración), nunca a través de este método. */
  record(data: CreateDayAuditLogData): Promise<DayAuditLog>;
}

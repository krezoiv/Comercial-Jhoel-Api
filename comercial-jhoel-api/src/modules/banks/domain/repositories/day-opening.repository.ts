import { DayOpening } from '../entities/day-opening.entity';

export const DAY_OPENING_REPOSITORY = Symbol('DAY_OPENING_REPOSITORY');

export type ClosedDayStatus = 'CLOSED' | 'REOPENED' | 'CANCELLED';
export type ResultSign = 'positive' | 'negative' | 'zero';

export interface ClosedDaysFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: ClosedDayStatus;
  /** Coincide contra opened_by, closed_by O reopened_by — "cualquier usuario involucrado en el ciclo de este día". */
  userId?: string;
  resultSign?: ResultSign;
}

/**
 * Fila de la lista "Gestión de Días Cerrados" — combina `day_openings` con
 * los totales del ÚLTIMO `agent_reconciliations` de esa fecha (puede haber
 * más de uno histórico si el día fue reabierto y vuelto a cerrar; el más
 * reciente es el que representa el cuadre vigente).
 */
export interface ClosedDayViewRow {
  date: string;
  status: ClosedDayStatus;
  openedAt: Date;
  openedByUsername: string;
  closedAt: Date | null;
  closedByUsername: string | null;
  reopenedAt: Date | null;
  reopenedByUsername: string | null;
  reopenReason: string | null;
  cancelledAt: Date | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  totalBanks: number | null;
  totalCash: number | null;
  totalAccountsReceivable: number | null;
  totalAssets: number | null;
  result: number | null;
}

export interface DayOpeningRepository {
  findByDate(date: string): Promise<DayOpening | null>;
  /** Idempotente: si la fecha ya está aperturada, devuelve la fila existente sin crear una segunda ni fallar. */
  open(date: string, userId: string): Promise<DayOpening>;
  /** "Gestión de Días Cerrados" — solo fechas que alguna vez tuvieron un cierre (CLOSED/REOPENED/CANCELLED), nunca días en curso. */
  findClosedDays(filters: ClosedDaysFilters): Promise<ClosedDayViewRow[]>;
  /** Vía `reopen_agent_day` (SQL) — valida estado/anulación/días posteriores y registra auditoría atómicamente. */
  reopen(date: string, userId: string, reason: string): Promise<DayOpening>;
  /** Vía `cancel_agent_day` (SQL) — mismo tipo de validación atómica que `reopen`. */
  cancel(date: string, userId: string, reason: string): Promise<DayOpening>;
}

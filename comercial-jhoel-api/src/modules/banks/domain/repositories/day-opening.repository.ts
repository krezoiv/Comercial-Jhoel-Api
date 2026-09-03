import { DayOpening } from '../entities/day-opening.entity';

export const DAY_OPENING_REPOSITORY = Symbol('DAY_OPENING_REPOSITORY');

export type ClosedDayStatus = 'CLOSED' | 'REOPENED' | 'CANCELLED';
export type ResultSign = 'positive' | 'negative' | 'zero';

export interface ClosedDaysFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: ClosedDayStatus;
  /** Matches against opened_by, closed_by, OR reopened_by — "any user involved in this day's cycle". */
  userId?: string;
  resultSign?: ResultSign;
}

/**
 * Row of the "Gestión de Días Cerrados" list — combines `day_openings`
 * with the totals from that date's LATEST `agent_reconciliations` row
 * (there can be more than one historical row if the day was reopened and
 * closed again; the most recent one is what represents the current
 * reconciliation).
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
  /** Idempotent: if the date is already open, returns the existing row instead of creating a second one or failing. */
  open(date: string, userId: string): Promise<DayOpening>;
  /** "Gestión de Días Cerrados" — only dates that were ever closed (CLOSED/REOPENED/CANCELLED), never a day still in progress. */
  findClosedDays(filters: ClosedDaysFilters): Promise<ClosedDayViewRow[]>;
  /** Via `reopen_agent_day` (SQL) — validates status/cancellation/later-day-exists and records the audit trail atomically. */
  reopen(date: string, userId: string, reason: string): Promise<DayOpening>;
  /** Via `cancel_agent_day` (SQL) — same kind of atomic validation as `reopen`. */
  cancel(date: string, userId: string, reason: string): Promise<DayOpening>;
}

import { RechargeDayOpening } from '../entities/recharge-day-opening.entity';

export const RECHARGE_DAY_OPENING_REPOSITORY = Symbol(
  'RECHARGE_DAY_OPENING_REPOSITORY',
);

export type RechargeClosedDayStatus = 'CLOSED' | 'REOPENED' | 'CANCELLED';
export type RechargeResultSign = 'positive' | 'negative' | 'zero';

export interface RechargeClosedDaysFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: RechargeClosedDayStatus;
  /** Matches against opened_by, closed_by, OR reopened_by — "any user involved in this day's cycle", same convention as Banks' own `ClosedDaysFilters`. */
  userId?: string;
  resultSign?: RechargeResultSign;
}

/**
 * Row of the "Gestión de Días de Recargas" list — combines
 * `recharge_day_openings` with the totals from that date's LATEST
 * `recharge_sales_closures` row (there can be more than one per date,
 * since this module's own cuadre-cycles feature lets several cuadres be
 * saved on the same calendar date; the most recent one is what
 * represents the current reconciliation) plus `cycleCount` — how many
 * cuadres were saved that day in total, a genuinely Recargas-specific
 * signal Banks' own equivalent row has no need for.
 */
export interface RechargeClosedDayViewRow {
  date: string;
  status: RechargeClosedDayStatus;
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
  totalSales: number | null;
  totalCollected: number | null;
  result: number | null;
  cycleCount: number;
}

export interface RechargeDayOpeningRepository {
  findByDate(date: string): Promise<RechargeDayOpening | null>;
  /** Idempotent: if the date is already open, returns the existing row instead of creating a second one or failing. */
  open(date: string, userId: string): Promise<RechargeDayOpening>;
  /** Via `close_recharge_day` (SQL) — requires at least one cuadre already saved for the date; carries no business data of its own (see the migration's own doc comment for why this is separate from "Guardar Cuadre", unlike Banks). */
  close(date: string, userId: string): Promise<RechargeDayOpening>;
  /** "Gestión de Días de Recargas" — only dates that were ever closed (CLOSED/REOPENED/CANCELLED), never a day still in progress. */
  findClosedDays(
    filters: RechargeClosedDaysFilters,
  ): Promise<RechargeClosedDayViewRow[]>;
  /** Via `reopen_recharge_day` (SQL) — validates status/cancellation/later-day-exists and records the audit trail atomically. */
  reopen(
    date: string,
    userId: string,
    reason: string,
  ): Promise<RechargeDayOpening>;
  /** Via `cancel_recharge_day` (SQL) — same kind of atomic validation as `reopen`. */
  cancel(
    date: string,
    userId: string,
    reason: string,
  ): Promise<RechargeDayOpening>;
}

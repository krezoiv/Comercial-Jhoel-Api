/**
 * The conceptual state of a date's "working cycle" — seven values, always
 * derived from the same three independent facts
 * (`isOpened`/`bankBalancesSaved`/`isClosed`), never stored separately:
 * - `NOT_OPENED`: no `day_openings` row exists for this date.
 * - `OPENED`: opened, but not every active bank has a balance saved for
 *   this date yet.
 * - `BANK_BALANCES_SAVED`: every balance saved, cuadre not done yet —
 *   Cuadre Agentes is now enabled.
 * - `RECONCILIATION_COMPLETED`: a cuadre exists for this date but the day
 *   was never formally closed — can only happen on data that predates
 *   "Cierre del Día" (since that ticket, saving a cuadre always closes
 *   the day in the same atomic operation, so this state can never occur
 *   for a new cuadre).
 * - `CLOSED`: this date's cycle is finished — blocked for new operations
 *   through the normal flow.
 * - `REOPENED`: was `CLOSED` and an ADMIN/SUPER_ADMIN reopened it from
 *   "Gestión de Días Cerrados" — balances can be edited and it can be
 *   closed again, exactly like `OPENED`/`BANK_BALANCES_SAVED` (`isClosed`
 *   is deliberately `false` in this state, see `DayOpening.isReopened`),
 *   but labeled differently so the UI can distinguish it from a day that
 *   was never closed.
 * - `CANCELLED`: the cycle was cancelled (soft delete) from "Gestión de
 *   Días Cerrados" — a terminal state, blocked the same as `CLOSED`.
 */
export type DayWorkStatus =
  | 'NOT_OPENED'
  | 'OPENED'
  | 'BANK_BALANCES_SAVED'
  | 'RECONCILIATION_COMPLETED'
  | 'CLOSED'
  | 'REOPENED'
  | 'CANCELLED';

export interface DayStatusOutput {
  date: string;
  status: DayWorkStatus;
  isOpened: boolean;
  bankBalancesSaved: boolean;
  canAccessReconciliation: boolean;
  reconciliationCompleted: boolean;
  isClosed: boolean;
  isCancelled: boolean;
}

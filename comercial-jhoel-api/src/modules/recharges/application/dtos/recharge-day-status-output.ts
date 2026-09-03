/**
 * The conceptual state of a Recargas date's "working cycle" — five values,
 * always derived from the same independent facts (is there a
 * `recharge_day_openings` row? is it closed? is it cancelled?), never
 * stored separately. Deliberately simpler than Banks' own seven-state
 * `DayWorkStatus`: Recargas never gates operations/ventas/cuadre behind a
 * nested "balances saved" pre-state the way Banks gates Cuadre Agentes
 * behind bank balances — the only two facts that actually gate anything
 * here are "is it open" and "is it closed".
 * - `NOT_OPENED`: no `recharge_day_openings` row exists for this date.
 * - `OPENED`: open, operations/ventas/cuadre all allowed.
 * - `REOPENED`: was `CLOSED` and an ADMIN/SUPER_ADMIN reopened it — admits
 *   the same operations as `OPENED` (`isClosed` is deliberately `false` in
 *   this state, see `RechargeDayOpening.isReopened`), labeled differently
 *   so the UI can distinguish it from a day that was never closed.
 * - `CLOSED`: this date's cycle is finished — blocked for new operations
 *   through the normal flow.
 * - `CANCELLED`: the cycle was cancelled (soft delete) — a terminal state,
 *   blocked the same as `CLOSED`.
 */
export type RechargeDayWorkStatus = 'NOT_OPENED' | 'OPENED' | 'REOPENED' | 'CLOSED' | 'CANCELLED';

export interface RechargeDayStatusOutput {
  date: string;
  status: RechargeDayWorkStatus;
  isOpened: boolean;
  isClosed: boolean;
  isCancelled: boolean;
  /** Whether at least one cuadre has been saved for this date — the precondition "Cerrar Día" requires. */
  hasSavedCuadreToday: boolean;
  /** `isOpened && !isClosed && !isCancelled && hasSavedCuadreToday` — the one signal the frontend's "Cerrar Día" button needs to enable/disable itself. */
  canCloseDay: boolean;
}

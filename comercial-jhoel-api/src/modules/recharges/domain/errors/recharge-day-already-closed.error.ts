import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "This Recargas day is already closed and can't accept new operations" —
 * covers every write this module's day-lifecycle gates once
 * `recharge_day_openings.closed_at` is no longer null: registering a
 * purchase, a sale (including editing/deleting an existing one), a saldo
 * final, or a new cuadre for that date. Distinct from the pre-existing
 * `DayAlreadyClosedError` in `day-already-closed.error.ts`, which means
 * something narrower — one operator/cycle's own `final_balance` already
 * set, independent of whether the whole day has been closed. Never thrown
 * for a date that was never opened — that case is `RechargeDayNotOpenedError`.
 */
export class RechargeDayAlreadyClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día de recargas correspondiente a esta operación (${date}) ya se encuentra cerrado.`);
  }
}

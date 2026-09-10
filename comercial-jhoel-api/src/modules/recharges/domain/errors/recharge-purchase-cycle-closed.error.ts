import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Thrown when a purchase's own cuadre cycle already has a `final_balance`
 * — no existing mechanism un-closes an already-closed cycle (verified
 * directly: `reopen_recharge_day()` only clears `recharge_day_openings
 * .closed_at`, never a cycle's `final_balance`), so this is a hard,
 * permanent block, never bypassable, not even by an admin.
 */
export class RechargePurchaseCycleClosedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Esta compra ya está relacionada con un cuadre cerrado y no puede revertirse directamente.',
    );
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "The day is already closed and can't be modified" — covers the
 * operations that get blocked once `day_openings.closed_at` is no longer
 * null: saving/editing that date's bank balances
 * (`SaveBankBalancesUseCase`) and saving a new cuadre for that same date
 * (`CloseAgentDayUseCase`, which is also what closes it). Never thrown
 * for a date that was never opened — that case is still
 * `DayNotOpenedError`, a distinct state.
 */
export class DayAlreadyClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `El día correspondiente a esta operación (${date}) ya se encuentra cerrado.`,
    );
  }
}

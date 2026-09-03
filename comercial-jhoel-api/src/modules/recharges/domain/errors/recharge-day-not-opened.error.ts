import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "The user must not be able to freely register recharge operations until
 * the day has been opened" — mirrors Banks' own `DayNotOpenedError`
 * reasoning. Only enforced for TODAY (`assertRechargeDayWritable`); a
 * past date being corrected never needs a retroactive opening, matching
 * the pre-existing, deliberately preserved rule Banks' own
 * `SaveBankBalancesUseCase` already established for this exact situation.
 */
export class RechargeDayNotOpenedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `Debe aperturar el día de recargas ${date} antes de registrar operaciones.`,
    );
  }
}

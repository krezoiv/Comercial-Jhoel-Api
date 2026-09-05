import { DomainError } from '../../../../shared/domain/domain-error';

/** A cash-denomination row had a negative quantity, or its denomination didn't match one of the fixed Q values the form allows. */
export class InvalidCashQuantityError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El desglose de efectivo contiene una denominación o cantidad inválida.',
    );
  }
}

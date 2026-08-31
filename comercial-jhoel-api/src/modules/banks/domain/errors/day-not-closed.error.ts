import { DomainError } from '../../../../shared/domain/domain-error';

/** Reabrir o anular solo tiene sentido sobre un día que realmente está CLOSED. */
export class DayNotClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día ${date} no está cerrado, no se puede reabrir ni anular.`);
  }
}

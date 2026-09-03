import { DomainError } from '../../../../shared/domain/domain-error';

/** Reopening or cancelling only makes sense for a day that's actually CLOSED. */
export class DayNotClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día ${date} no está cerrado, no se puede reabrir ni anular.`);
  }
}

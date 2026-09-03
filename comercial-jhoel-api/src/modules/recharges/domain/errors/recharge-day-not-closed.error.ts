import { DomainError } from '../../../../shared/domain/domain-error';

/** Reopening or cancelling only makes sense for a Recargas day that's actually CLOSED. */
export class RechargeDayNotClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `El día de recargas ${date} no está cerrado, no se puede reabrir ni anular.`,
    );
  }
}

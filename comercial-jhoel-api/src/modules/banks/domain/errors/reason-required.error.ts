import { DomainError } from '../../../../shared/domain/domain-error';

export class ReopenReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para reabrir el día.');
  }
}

export class CancelReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para anular el día.');
  }
}

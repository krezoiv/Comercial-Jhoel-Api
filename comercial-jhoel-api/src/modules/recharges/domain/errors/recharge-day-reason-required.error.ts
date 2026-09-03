import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeReopenReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para reabrir el día de recargas.');
  }
}

export class RechargeCancelReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para anular el día de recargas.');
  }
}

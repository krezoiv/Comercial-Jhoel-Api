import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseVoidReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para anular la factura.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleVoidReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para anular la venta.');
  }
}

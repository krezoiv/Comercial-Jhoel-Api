import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleVoidReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debes indicar un motivo para anular esta venta de SIM.');
  }
}

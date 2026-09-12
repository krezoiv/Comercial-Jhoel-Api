import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleRegistrationVoidReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debes indicar un motivo para anular este registro de venta de SIM.');
  }
}

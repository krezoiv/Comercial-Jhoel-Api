import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Esta venta de SIM ya fue anulada anteriormente.');
  }
}

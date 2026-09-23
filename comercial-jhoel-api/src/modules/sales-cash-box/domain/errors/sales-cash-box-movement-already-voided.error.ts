import { DomainError } from '../../../../shared/domain/domain-error';

export class SalesCashBoxMovementAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Este movimiento de caja ya fue anulado.');
  }
}

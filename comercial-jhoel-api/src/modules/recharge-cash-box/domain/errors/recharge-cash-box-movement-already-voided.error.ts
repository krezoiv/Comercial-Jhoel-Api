import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeCashBoxMovementAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Este movimiento de caja ya fue anulado.');
  }
}

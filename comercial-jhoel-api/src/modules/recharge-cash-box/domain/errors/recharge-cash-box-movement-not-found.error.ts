import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeCashBoxMovementNotFoundError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El movimiento de caja indicado no existe.');
  }
}

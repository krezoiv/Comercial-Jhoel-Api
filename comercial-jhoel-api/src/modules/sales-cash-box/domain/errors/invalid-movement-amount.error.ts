import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidMovementAmountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El monto del movimiento debe ser mayor a cero.');
  }
}

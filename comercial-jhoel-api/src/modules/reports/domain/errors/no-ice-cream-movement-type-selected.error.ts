import { DomainError } from '../../../../shared/domain/domain-error';

export class NoIceCreamMovementTypeSelectedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe seleccionar al menos un tipo de movimiento.');
  }
}

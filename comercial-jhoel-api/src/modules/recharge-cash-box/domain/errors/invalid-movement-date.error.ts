import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidMovementDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de negocio no puede ser una fecha futura.');
  }
}

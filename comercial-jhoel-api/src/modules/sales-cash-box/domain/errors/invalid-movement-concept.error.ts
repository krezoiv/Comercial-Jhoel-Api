import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidMovementConceptError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un concepto u observación para el movimiento.');
  }
}

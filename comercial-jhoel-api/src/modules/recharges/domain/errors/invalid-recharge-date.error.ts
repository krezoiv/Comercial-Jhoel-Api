import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidRechargeDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de operación no puede ser una fecha futura.');
  }
}

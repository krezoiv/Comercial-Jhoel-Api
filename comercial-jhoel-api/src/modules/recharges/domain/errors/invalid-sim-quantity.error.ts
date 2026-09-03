import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidSimQuantityError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La cantidad debe ser un número entero mayor que cero.');
  }
}

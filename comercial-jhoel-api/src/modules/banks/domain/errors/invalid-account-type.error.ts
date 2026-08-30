import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidAccountTypeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El tipo de cuenta indicado no existe o no está activo.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidBusinessError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El negocio indicado no existe o no está activo.');
  }
}

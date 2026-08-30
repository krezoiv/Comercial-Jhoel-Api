import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidRoleError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El rol indicado no existe o no está activo.');
  }
}

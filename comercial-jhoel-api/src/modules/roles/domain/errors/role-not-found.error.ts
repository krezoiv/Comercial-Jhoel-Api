import { DomainError } from '../../../../shared/domain/domain-error';

export class RoleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Rol no encontrado: ${identifier}`);
  }
}

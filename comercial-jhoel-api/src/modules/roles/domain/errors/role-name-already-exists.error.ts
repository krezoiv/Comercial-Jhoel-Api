import { DomainError } from '../../../../shared/domain/domain-error';

export class RoleNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un rol con el nombre: ${name}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class SystemRoleImmutableError extends DomainError {
  readonly status = 400;

  constructor() {
    super('No se puede modificar el nombre de un rol del sistema.');
  }
}

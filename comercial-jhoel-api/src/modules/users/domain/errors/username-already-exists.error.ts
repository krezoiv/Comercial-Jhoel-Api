import { DomainError } from '../../../../shared/domain/domain-error';

export class UsernameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(username: string) {
    super(`El nombre de usuario ya está en uso: ${username}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidCredentialsError extends DomainError {
  readonly status = 401;

  constructor() {
    super('Credenciales inválidas.');
  }
}

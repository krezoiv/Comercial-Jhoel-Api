import { DomainError } from '../../../../shared/domain/domain-error';

export class UserNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Usuario no encontrado: ${identifier}`);
  }
}

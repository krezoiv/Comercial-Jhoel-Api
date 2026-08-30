import { DomainError } from '../../../../shared/domain/domain-error';

export class AccountTypeNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Tipo de cuenta no encontrado: ${identifier}`);
  }
}

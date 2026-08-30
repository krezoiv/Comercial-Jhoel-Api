import { DomainError } from '../../../../shared/domain/domain-error';

export class BankNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Banco no encontrado: ${identifier}`);
  }
}

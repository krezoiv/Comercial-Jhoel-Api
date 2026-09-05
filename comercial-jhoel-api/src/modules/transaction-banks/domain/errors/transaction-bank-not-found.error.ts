import { DomainError } from '../../../../shared/domain/domain-error';

export class TransactionBankNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Banco agente no encontrado: ${identifier}`);
  }
}

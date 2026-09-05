import { DomainError } from '../../../../shared/domain/domain-error';

export class TransactionTypeNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Tipo de transacción no encontrado: ${identifier}`);
  }
}

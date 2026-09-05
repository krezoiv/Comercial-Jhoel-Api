import { DomainError } from '../../../../shared/domain/domain-error';

export class BankDepositOperationNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Transacción no encontrada: ${identifier}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class BankDepositOperationAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`La transacción ya fue anulada: ${identifier}`);
  }
}

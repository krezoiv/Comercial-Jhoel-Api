import { DomainError } from '../../../../shared/domain/domain-error';

/** Raised when a deposit operation (Transaccionar) is registered against a deactivated tipo de transacción. */
export class TransactionTypeInactiveError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`El tipo de transacción ${identifier} está inactivo.`);
  }
}

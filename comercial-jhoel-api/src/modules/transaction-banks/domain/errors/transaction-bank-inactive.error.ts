import { DomainError } from '../../../../shared/domain/domain-error';

/** Raised when a deposit operation (Transaccionar) is registered against a deactivated banco agente. */
export class TransactionBankInactiveError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`El banco agente ${identifier} está inactivo.`);
  }
}

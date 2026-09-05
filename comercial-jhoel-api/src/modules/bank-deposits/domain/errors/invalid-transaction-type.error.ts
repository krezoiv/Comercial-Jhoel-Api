import { DomainError } from '../../../../shared/domain/domain-error';

/** The selected tipo de transacción doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way it rejects an invalid banco agente. */
export class InvalidTransactionTypeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El tipo de transacción seleccionado no existe o está inactivo.');
  }
}

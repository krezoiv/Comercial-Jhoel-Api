import { DomainError } from '../../../../shared/domain/domain-error';

/** The selected banco agente doesn't exist, or exists but is inactive — `register_bank_deposit_operation` rejects both the same way `confirm_purchase` rejects an invalid supplier. */
export class InvalidTransactionBankError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El banco agente seleccionado no existe o está inactivo.');
  }
}

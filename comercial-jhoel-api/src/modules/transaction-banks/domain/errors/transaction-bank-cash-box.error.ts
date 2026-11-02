import { DomainError } from '../../../../shared/domain/domain-error';

/** Solo un banco agente puede ser Cooperativa Guayacán (índice único `UQ_transaction_banks_cash_box_code`). */
export class TransactionBankCashBoxAlreadyAssignedError extends DomainError {
  readonly status = 409;

  constructor() {
    super('Ya hay otro banco agente marcado como Cooperativa Guayacán.');
  }
}

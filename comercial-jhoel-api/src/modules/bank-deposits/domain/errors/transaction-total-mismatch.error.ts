import { DomainError } from '../../../../shared/domain/domain-error';

/** The N sub-transaction amounts the total is being split into must also sum to exactly the total amount. */
export class TransactionTotalMismatchError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'La suma de las transacciones no coincide con el monto total a depositar. Verifica los montos antes de guardar.',
    );
  }
}

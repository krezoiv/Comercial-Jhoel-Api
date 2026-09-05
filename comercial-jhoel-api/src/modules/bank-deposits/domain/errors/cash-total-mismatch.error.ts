import { DomainError } from '../../../../shared/domain/domain-error';

/** The heart of the "cuadre" rule: the physical cash breakdown must sum to exactly the total amount, or `register_bank_deposit_operation` rolls back the whole operation. */
export class CashTotalMismatchError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El efectivo contado no coincide con el monto total a depositar. Verifica el desglose antes de guardar.',
    );
  }
}

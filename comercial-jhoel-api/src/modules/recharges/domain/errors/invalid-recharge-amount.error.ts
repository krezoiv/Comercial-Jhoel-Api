import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidRechargeAmountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El monto de la compra debe ser mayor que cero.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidDepositAmountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El monto total a depositar debe ser mayor a cero.');
  }
}

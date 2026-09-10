import { DomainError } from '../../../../shared/domain/domain-error';

export class WithdrawalExceedsBalanceError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El monto de la salida no puede ser mayor al saldo disponible de la caja.',
    );
  }
}

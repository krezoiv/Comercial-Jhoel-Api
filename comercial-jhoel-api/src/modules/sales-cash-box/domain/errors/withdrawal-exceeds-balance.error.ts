import { DomainError } from '../../../../shared/domain/domain-error';

export class WithdrawalExceedsBalanceError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El monto del retiro no puede ser mayor al saldo disponible de ese negocio.',
    );
  }
}

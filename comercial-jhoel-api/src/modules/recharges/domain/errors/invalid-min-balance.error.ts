import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidMinBalanceError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El saldo mínimo debe ser mayor o igual a cero.');
  }
}

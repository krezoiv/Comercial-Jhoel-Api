import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidBalanceLimitError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El límite de saldo debe ser mayor o igual a cero.');
  }
}

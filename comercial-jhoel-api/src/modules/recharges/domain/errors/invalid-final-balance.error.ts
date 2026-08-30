import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidFinalBalanceError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El saldo final no puede ser negativo.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class FinalBalanceExceedsDailyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El saldo final no puede ser mayor que el saldo del día disponible.');
  }
}

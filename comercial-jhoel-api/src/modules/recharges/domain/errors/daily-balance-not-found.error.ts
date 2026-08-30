import { DomainError } from '../../../../shared/domain/domain-error';

export class DailyBalanceNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el saldo diario ${id}.`);
  }
}

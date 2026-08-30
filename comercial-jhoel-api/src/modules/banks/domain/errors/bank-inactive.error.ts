import { DomainError } from '../../../../shared/domain/domain-error';

export class BankInactiveError extends DomainError {
  readonly status = 400;

  constructor(bankId: string) {
    super(`Este banco no está activo: ${bankId}`);
  }
}

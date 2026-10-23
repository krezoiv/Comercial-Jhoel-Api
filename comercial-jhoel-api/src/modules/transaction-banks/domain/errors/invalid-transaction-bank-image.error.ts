import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidTransactionBankImageError extends DomainError {
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}

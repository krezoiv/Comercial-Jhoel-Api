import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPaymentDataError extends DomainError {
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}

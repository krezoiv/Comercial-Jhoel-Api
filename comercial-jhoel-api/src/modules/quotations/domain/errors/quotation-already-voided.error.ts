import { DomainError } from '../../../../shared/domain/domain-error';

export class QuotationAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`La cotización ya está anulada: ${identifier}`);
  }
}

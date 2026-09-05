import { DomainError } from '../../../../shared/domain/domain-error';

export class QuotationNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Cotización no encontrada: ${identifier}`);
  }
}

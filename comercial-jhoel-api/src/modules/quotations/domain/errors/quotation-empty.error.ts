import { DomainError } from '../../../../shared/domain/domain-error';

export class QuotationEmptyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La cotización debe contener al menos un producto.');
  }
}

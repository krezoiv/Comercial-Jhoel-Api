import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPurchaseDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de compra no es válida.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidIceCreamPurchaseDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de compra no es válida.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamPurchaseEmptyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La compra debe contener al menos un helado.');
  }
}

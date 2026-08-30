import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamSaleEmptyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La venta debe contener al menos un helado.');
  }
}

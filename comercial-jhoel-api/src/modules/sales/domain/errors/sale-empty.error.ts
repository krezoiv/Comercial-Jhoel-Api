import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleEmptyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La venta debe contener al menos un producto.');
  }
}

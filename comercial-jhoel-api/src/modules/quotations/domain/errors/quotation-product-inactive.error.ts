import { DomainError } from '../../../../shared/domain/domain-error';

export class QuotationProductInactiveError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Producto inactivo: ${productId}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleProductInactiveError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Este producto no está disponible para venta: ${productId}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseProductInactiveError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Este producto no está disponible para compra: ${productId}`);
  }
}

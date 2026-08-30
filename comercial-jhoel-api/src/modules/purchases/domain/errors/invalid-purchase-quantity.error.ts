import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPurchaseQuantityError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Cantidad inválida para el producto: ${productId}`);
  }
}

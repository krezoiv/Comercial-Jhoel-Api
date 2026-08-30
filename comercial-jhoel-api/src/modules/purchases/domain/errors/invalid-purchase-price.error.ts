import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPurchasePriceError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Precio inválido para el producto: ${productId}`);
  }
}

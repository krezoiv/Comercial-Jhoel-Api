import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseProductNotFoundError extends DomainError {
  readonly status = 404;

  constructor(productId: string) {
    super(`Producto no encontrado: ${productId}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InsufficientStockError extends DomainError {
  readonly status = 409;

  constructor(productId: string) {
    super(
      `No hay suficiente stock disponible para completar la venta: ${productId}`,
    );
  }
}

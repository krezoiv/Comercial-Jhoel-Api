import { DomainError } from '../../../../shared/domain/domain-error';

/** The stock this purchase brought in was already partially or fully consumed elsewhere (a sale, a transfer, another purchase's own correction) — reverting it would take a product negative. */
export class InsufficientStockToRevertPurchaseError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(
      `No se puede anular esta factura porque dejaría el inventario del producto en negativo: ${productId}`,
    );
  }
}

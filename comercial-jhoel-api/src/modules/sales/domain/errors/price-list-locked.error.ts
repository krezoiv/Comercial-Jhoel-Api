import { DomainError } from '../../../../shared/domain/domain-error';

/** Raised by `configure_open_sale()` when the receipt already has line items priced under a different price list — changing it now would leave those lines' prices inconsistent with the new list. Cancel and start over instead. */
export class PriceListLockedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No se puede cambiar la lista de precios de una venta que ya tiene productos agregados. Cancela la venta y comienza de nuevo si necesitas cambiarla.',
    );
  }
}

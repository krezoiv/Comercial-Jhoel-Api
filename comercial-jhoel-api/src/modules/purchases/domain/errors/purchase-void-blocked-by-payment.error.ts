import { DomainError } from '../../../../shared/domain/domain-error';

/** Fires only when a CREDITO purchase was already marked as paid via a separate "Marcar como pagada" action — never for a CONTADO purchase, which is always `PAID` from the moment it's created (see `confirm_purchase`) and is NOT what this guard is protecting against. */
export class PurchaseVoidBlockedByPaymentError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Esta factura ya fue marcada como pagada y no puede anularse directamente. Corrija primero el estado de pago o consulte con un administrador.',
    );
  }
}

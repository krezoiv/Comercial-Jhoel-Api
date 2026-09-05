import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidTransferQuantityError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La cantidad a trasladar debe ser un número entero mayor que cero.');
  }
}

export class SameLocationTransferError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El origen y el destino del traslado no pueden ser la misma ubicación.',
    );
  }
}

/** Enforced in `register_inventory_transfer()` under `FOR UPDATE` locks on both locations — never trusts the frontend's own stock check. */
export class InsufficientLocationStockError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(
      `No hay suficiente stock en la ubicación de origen para trasladar este producto (${productId}).`,
    );
  }
}

export class InventoryProductInactiveError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`El producto ${productId} no está activo.`);
  }
}

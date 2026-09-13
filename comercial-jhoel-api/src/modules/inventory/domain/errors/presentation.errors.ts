import { DomainError } from '../../../../shared/domain/domain-error';

export class PresentationNotFoundError extends DomainError {
  readonly status = 404;

  constructor(productId: string) {
    super(
      `No se encontró la presentación indicada para el producto ${productId}.`,
    );
  }
}

export class PresentationInactiveError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(
      `La presentación indicada para el producto ${productId} no está activa.`,
    );
  }
}

/** The "Unidad" presentation (factor 1) is created automatically per product and can never be deactivated — every purchase/sale/report that omits a presentation depends on it always existing. */
export class UnidadPresentationImmutableError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'La presentación "Unidad" no puede desactivarse ni eliminarse — es la presentación base del producto.',
    );
  }
}

export class PresentationNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor() {
    super('Este producto ya tiene una presentación activa de ese tipo.');
  }
}

/** Mirrors `ProductSkuAlreadyExistsError` — barcodes are unique across every active presentation, not just within one product. */
export class PresentationBarcodeAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor() {
    super('Ya existe una presentación activa con ese código de barras.');
  }
}

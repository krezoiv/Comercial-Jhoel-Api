import { DomainError } from '../../../../shared/domain/domain-error';

/** Covers both "no existe" and "está inactivo" — same single-message rule already used by `InvalidBusinessError` (Products) and `InvalidSupplierError` (Purchases) for their own referenced-entity checks. */
export class InvalidCashBoxBusinessError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El negocio indicado no existe o no está activo.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

/** A USER account trying to view an ice cream purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase. */
export class IceCreamPurchaseAccessDeniedError extends DomainError {
  readonly status = 403;

  constructor() {
    super('No tienes permisos para ver esta compra.');
  }
}

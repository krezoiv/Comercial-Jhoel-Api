import { DomainError } from '../../../../shared/domain/domain-error';

/** A USER account trying to view a purchase that isn't theirs — ADMIN/SUPER_ADMIN can view any purchase. */
export class PurchaseAccessDeniedError extends DomainError {
  readonly status = 403;

  constructor() {
    super('No tienes permisos para ver esta compra.');
  }
}

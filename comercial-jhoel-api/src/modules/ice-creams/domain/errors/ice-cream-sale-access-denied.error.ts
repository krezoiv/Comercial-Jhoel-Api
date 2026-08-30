import { DomainError } from '../../../../shared/domain/domain-error';

/** A USER account trying to view an ice cream sale that isn't theirs — ADMIN/SUPER_ADMIN can view any sale. */
export class IceCreamSaleAccessDeniedError extends DomainError {
  readonly status = 403;

  constructor() {
    super('No tienes permisos para ver esta venta.');
  }
}

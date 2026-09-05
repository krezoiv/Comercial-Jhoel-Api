import { DomainError } from '../../../../shared/domain/domain-error';

/** A USER account trying to view a quotation that isn't theirs — ADMIN/SUPER_ADMIN can view any quotation. */
export class QuotationAccessDeniedError extends DomainError {
  readonly status = 403;

  constructor() {
    super('No tienes permisos para ver esta cotización.');
  }
}

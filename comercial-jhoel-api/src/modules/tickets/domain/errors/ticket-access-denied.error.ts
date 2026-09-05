import { DomainError } from '../../../../shared/domain/domain-error';

/** A USER account trying to view a ticket that isn't theirs — ADMIN/SUPER_ADMIN can view any ticket. */
export class TicketAccessDeniedError extends DomainError {
  readonly status = 403;

  constructor() {
    super('No tienes permisos para ver este ticket.');
  }
}

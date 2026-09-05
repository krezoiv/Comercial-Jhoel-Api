import { DomainError } from '../../../../shared/domain/domain-error';

/** The referenced client doesn't exist or is deactivated — this module's own copy, mirroring `sales`'/`tickets`' `InvalidClientError` (each module owns its error classes, even for a shared concept). Unlike a Ticket's optional client, a Cotización's client is always required. */
export class InvalidClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente no existe o está inactivo.');
  }
}

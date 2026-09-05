import { DomainError } from '../../../../shared/domain/domain-error';

export class TicketNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Ticket no encontrado: ${identifier}`);
  }
}

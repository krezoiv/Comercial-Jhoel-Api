import { DomainError } from '../../../../shared/domain/domain-error';

export class TicketAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`El ticket ya está anulado: ${identifier}`);
  }
}

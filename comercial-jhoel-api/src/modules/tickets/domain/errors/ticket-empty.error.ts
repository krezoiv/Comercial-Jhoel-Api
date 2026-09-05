import { DomainError } from '../../../../shared/domain/domain-error';

export class TicketEmptyError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El ticket debe contener al menos un producto.');
  }
}

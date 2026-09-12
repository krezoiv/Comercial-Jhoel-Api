import { DomainError } from '../../../../shared/domain/domain-error';

export class ClientDpiRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El DPI del cliente es obligatorio.');
  }
}

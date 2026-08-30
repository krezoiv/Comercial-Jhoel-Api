import { DomainError } from '../../../../shared/domain/domain-error';

export class ReferencedClientNotFoundError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente seleccionado no existe.');
  }
}

export class ReferencedClientInactiveError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente seleccionado se encuentra inactivo.');
  }
}

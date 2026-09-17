import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogPhoneInactiveError extends DomainError {
  readonly status = 400;

  constructor() {
    super('No se puede publicar un teléfono desactivado.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

/** Librería es puramente informativa — nunca genera solicitudes de interés. */
export class CatalogProductRequestNotAllowedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Este catálogo no permite solicitudes de interés.');
  }
}

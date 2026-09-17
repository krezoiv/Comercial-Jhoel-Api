import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogProductRequestNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la solicitud con id: ${id}`);
  }
}

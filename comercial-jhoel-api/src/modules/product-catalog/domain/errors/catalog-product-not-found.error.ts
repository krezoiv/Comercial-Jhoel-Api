import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogProductNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la publicación de catálogo con id: ${id}`);
  }
}

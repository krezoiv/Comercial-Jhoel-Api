import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogImageNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la imagen del catálogo con id: ${id}`);
  }
}

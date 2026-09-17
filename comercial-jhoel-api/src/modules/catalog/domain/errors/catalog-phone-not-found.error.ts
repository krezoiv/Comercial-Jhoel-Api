import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogPhoneNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el teléfono del catálogo con id: ${id}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogBankNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el banco con id: ${id}`);
  }
}

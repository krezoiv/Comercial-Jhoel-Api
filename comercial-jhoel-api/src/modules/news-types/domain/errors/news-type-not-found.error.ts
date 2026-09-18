import { DomainError } from '../../../../shared/domain/domain-error';

export class NewsTypeNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el tipo de noticia con id: ${id}`);
  }
}

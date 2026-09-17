import { DomainError } from '../../../../shared/domain/domain-error';

export class NewsArticleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la noticia con id: ${id}`);
  }
}

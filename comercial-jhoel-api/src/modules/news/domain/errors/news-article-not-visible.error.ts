import { DomainError } from '../../../../shared/domain/domain-error';

/** 404 tanto si no existe como si existe pero está inactiva — nunca revela cuál, mismo criterio de Teléfonos/Librería/Variedades. */
export class NewsArticleNotVisibleError extends DomainError {
  readonly status = 404;

  constructor() {
    super('La noticia solicitada no está disponible.');
  }
}

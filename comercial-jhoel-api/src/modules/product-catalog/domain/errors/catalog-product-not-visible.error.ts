import { DomainError } from '../../../../shared/domain/domain-error';

/** 404 tanto si no existe como si existe pero no está visible públicamente — nunca revela cuál, mismo criterio ya usado por el catálogo de Teléfonos. */
export class CatalogProductNotVisibleError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El producto solicitado no está disponible en el catálogo.');
  }
}

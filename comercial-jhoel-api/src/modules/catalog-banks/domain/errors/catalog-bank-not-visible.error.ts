import { DomainError } from '../../../../shared/domain/domain-error';

/** Reusado tanto para "no existe" como para "existe pero está inactivo" — un 404 público nunca revela cuál de los dos casos ocurrió. */
export class CatalogBankNotVisibleError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El banco solicitado no está disponible en el catálogo.');
  }
}

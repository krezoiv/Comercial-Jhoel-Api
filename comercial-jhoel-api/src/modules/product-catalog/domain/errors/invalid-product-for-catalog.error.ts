import { DomainError } from '../../../../shared/domain/domain-error';

/** El producto de Inventario referenciado no existe o está inactivo — nunca se publica un producto que Inventario ya no reconoce. */
export class InvalidProductForCatalogError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El producto seleccionado no existe o está inactivo en Inventario.');
  }
}

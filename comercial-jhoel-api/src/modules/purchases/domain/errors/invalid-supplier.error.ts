import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidSupplierError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El proveedor indicado no existe o no está activo.');
  }
}

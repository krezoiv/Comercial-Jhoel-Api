import { DomainError } from '../../../../shared/domain/domain-error';

export class SupplierNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Proveedor no encontrado: ${identifier}`);
  }
}

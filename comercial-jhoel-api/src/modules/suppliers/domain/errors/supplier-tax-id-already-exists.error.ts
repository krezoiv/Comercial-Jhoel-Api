import { DomainError } from '../../../../shared/domain/domain-error';

export class SupplierTaxIdAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(taxId: string) {
    super(`Ya existe un proveedor activo con el NIT: ${taxId}`);
  }
}

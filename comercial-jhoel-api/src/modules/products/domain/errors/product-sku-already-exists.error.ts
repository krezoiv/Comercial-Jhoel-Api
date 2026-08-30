import { DomainError } from '../../../../shared/domain/domain-error';

export class ProductSkuAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(sku: string) {
    super(`Ya existe un producto activo con el SKU: ${sku}`);
  }
}

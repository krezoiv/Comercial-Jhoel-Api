import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamSkuAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(sku: string) {
    super(`Ya existe un helado activo con el SKU: ${sku}`);
  }
}

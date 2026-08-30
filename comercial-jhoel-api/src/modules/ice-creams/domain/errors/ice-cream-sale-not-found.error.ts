import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamSaleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Venta de heladería no encontrada: ${identifier}`);
  }
}

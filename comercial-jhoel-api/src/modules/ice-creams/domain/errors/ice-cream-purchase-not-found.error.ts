import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamPurchaseNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Compra de heladería no encontrada: ${identifier}`);
  }
}

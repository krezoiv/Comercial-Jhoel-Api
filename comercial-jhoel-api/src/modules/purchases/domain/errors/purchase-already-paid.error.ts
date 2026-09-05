import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseAlreadyPaidError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`La compra ya está marcada como pagada: ${identifier}`);
  }
}

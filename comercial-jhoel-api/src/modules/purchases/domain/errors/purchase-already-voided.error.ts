import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`Esta factura ya fue anulada anteriormente: ${identifier}`);
  }
}

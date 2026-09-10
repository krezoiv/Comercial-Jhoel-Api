import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`Esta venta ya fue anulada anteriormente: ${identifier}`);
  }
}

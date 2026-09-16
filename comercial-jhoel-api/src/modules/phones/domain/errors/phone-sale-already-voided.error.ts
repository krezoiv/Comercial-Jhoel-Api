import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneSaleAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(id: string) {
    super(`Esta venta de teléfono ya fue anulada (id: ${id}).`);
  }
}

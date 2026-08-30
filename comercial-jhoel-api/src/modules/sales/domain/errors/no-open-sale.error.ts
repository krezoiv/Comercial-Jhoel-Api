import { DomainError } from '../../../../shared/domain/domain-error';

/** Confirming/cancelling/fetching a caller's in-progress receipt when they don't have one open. */
export class NoOpenSaleError extends DomainError {
  readonly status = 404;

  constructor() {
    super('No tienes una venta en construcción.');
  }
}

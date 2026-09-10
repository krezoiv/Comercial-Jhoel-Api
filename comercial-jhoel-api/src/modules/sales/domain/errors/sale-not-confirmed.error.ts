import { DomainError } from '../../../../shared/domain/domain-error';

/** A borrador (`OPEN`) sale can't be anulada directly — it has its own correction mechanism (`cancel_open_sale`, which discards it entirely since it was never a real transaction). This should be unreachable through the normal admin UI (which only ever lists `CONFIRMED` sales), and only exists as defense-in-depth against a direct API call. */
export class SaleNotConfirmedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(
      `Esta venta aún es un borrador y no puede anularse directamente: ${identifier}`,
    );
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleReportNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la venta ${id}.`);
  }
}

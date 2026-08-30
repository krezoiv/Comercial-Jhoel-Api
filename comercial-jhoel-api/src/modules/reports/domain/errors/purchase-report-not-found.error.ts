import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseReportNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la compra ${id}.`);
  }
}

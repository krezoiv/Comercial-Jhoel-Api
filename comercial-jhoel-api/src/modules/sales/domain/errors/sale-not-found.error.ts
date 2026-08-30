import { DomainError } from '../../../../shared/domain/domain-error';

export class SaleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Venta no encontrada: ${identifier}`);
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class PurchaseNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Compra no encontrada: ${identifier}`);
  }
}

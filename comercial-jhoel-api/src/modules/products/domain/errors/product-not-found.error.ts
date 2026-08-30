import { DomainError } from '../../../../shared/domain/domain-error';

export class ProductNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Producto no encontrado: ${identifier}`);
  }
}

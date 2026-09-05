import { DomainError } from '../../../../shared/domain/domain-error';

export class TicketProductNotFoundError extends DomainError {
  readonly status = 400;

  constructor(productId: string) {
    super(`Producto no encontrado: ${productId}`);
  }
}

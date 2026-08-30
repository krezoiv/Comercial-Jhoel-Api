import { DomainError } from '../../../../shared/domain/domain-error';

export class InsufficientIceCreamStockError extends DomainError {
  readonly status = 400;

  constructor(iceCreamId: string) {
    super(`Stock insuficiente para el helado: ${iceCreamId}`);
  }
}

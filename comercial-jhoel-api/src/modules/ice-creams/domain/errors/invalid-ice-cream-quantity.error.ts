import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidIceCreamQuantityError extends DomainError {
  readonly status = 400;

  constructor(iceCreamId: string) {
    super(`Cantidad inválida para el helado: ${iceCreamId}`);
  }
}

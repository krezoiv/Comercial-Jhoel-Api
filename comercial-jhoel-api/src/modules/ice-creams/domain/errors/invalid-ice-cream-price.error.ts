import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidIceCreamPriceError extends DomainError {
  readonly status = 400;

  constructor(iceCreamId: string) {
    super(`Precio inválido para el helado: ${iceCreamId}`);
  }
}

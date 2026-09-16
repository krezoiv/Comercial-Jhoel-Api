import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPhoneSalePriceError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El precio de venta debe ser un número mayor o igual a cero.');
  }
}

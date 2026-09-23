import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidSalesRegisterDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de la caja de ventas no puede ser futura.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidSimSaleClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente seleccionado no existe o se encuentra inactivo.');
  }
}

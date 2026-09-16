import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPhoneSaleClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente seleccionado no existe o está inactivo.');
  }
}

import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidPhoneNumberError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El número de teléfono es inválido.');
  }
}

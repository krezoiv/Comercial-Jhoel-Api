import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidBankAccountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La cuenta bancaria seleccionada no existe o está inactiva.');
  }
}

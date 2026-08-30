import { DomainError } from '../../../../shared/domain/domain-error';

export class BankAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string, accountNumber: string) {
    super(
      `Ya existe un banco activo "${name}" con la cuenta ${accountNumber}.`,
    );
  }
}

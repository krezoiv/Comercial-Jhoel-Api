import { DomainError } from '../../../../shared/domain/domain-error';

export class TransactionBankNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un banco agente activo con el nombre: ${name}`);
  }
}

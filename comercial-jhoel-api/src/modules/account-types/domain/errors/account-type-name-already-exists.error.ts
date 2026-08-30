import { DomainError } from '../../../../shared/domain/domain-error';

export class AccountTypeNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un tipo de cuenta activo con el nombre: ${name}`);
  }
}

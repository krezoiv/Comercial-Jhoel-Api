import { DomainError } from '../../../../shared/domain/domain-error';

export class ClientNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un cliente registrado con este nombre: ${name}`);
  }
}

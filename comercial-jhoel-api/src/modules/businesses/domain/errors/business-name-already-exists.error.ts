import { DomainError } from '../../../../shared/domain/domain-error';

export class BusinessNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un negocio con el nombre: ${name}`);
  }
}

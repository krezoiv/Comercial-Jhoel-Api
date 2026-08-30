import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un helado activo con el nombre: ${name}`);
  }
}

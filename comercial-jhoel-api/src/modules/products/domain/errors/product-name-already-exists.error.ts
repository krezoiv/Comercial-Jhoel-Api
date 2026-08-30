import { DomainError } from '../../../../shared/domain/domain-error';

export class ProductNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string) {
    super(`Ya existe un producto activo con el nombre: ${name}`);
  }
}

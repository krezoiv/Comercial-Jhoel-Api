import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidCategoryError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La categoría indicada no existe o no está activa.');
  }
}

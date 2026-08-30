import { DomainError } from '../../../../shared/domain/domain-error';

export class CategoryNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Categoría no encontrada: ${identifier}`);
  }
}

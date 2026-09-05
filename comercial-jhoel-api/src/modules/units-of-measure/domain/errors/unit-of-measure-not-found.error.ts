import { DomainError } from '../../../../shared/domain/domain-error';

export class UnitOfMeasureNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Unidad de medida no encontrada: ${identifier}`);
  }
}

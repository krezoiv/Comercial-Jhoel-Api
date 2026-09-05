import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidUnitOfMeasureError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La unidad de medida indicada no existe o no está activa.');
  }
}

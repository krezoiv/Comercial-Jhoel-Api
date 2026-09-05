import { DomainError } from '../../../../shared/domain/domain-error';

export class UnitOfMeasureAbbreviationAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(abbreviation: string) {
    super(`Ya existe una unidad de medida activa con la abreviatura: ${abbreviation}`);
  }
}

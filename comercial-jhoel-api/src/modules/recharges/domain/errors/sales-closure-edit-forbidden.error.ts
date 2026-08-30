import { DomainError } from '../../../../shared/domain/domain-error';

export class SalesClosureEditForbiddenError extends DomainError {
  readonly status = 403;

  constructor() {
    super(
      'Ya existe un cuadre guardado para hoy. Solo un administrador puede corregirlo.',
    );
  }
}

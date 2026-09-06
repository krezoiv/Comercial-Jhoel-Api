import { DomainError } from '../../../../shared/domain/domain-error';

/** El vuelto debe ser >= 0 y nunca mayor al efectivo recibido — la función SQL es la fuente de verdad, este error solo traduce su `RAISE EXCEPTION`. */
export class InvalidChangeGivenError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El vuelto debe ser mayor o igual a cero y no puede exceder el efectivo recibido.');
  }
}

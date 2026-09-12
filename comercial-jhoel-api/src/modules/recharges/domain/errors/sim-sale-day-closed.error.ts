import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleDayClosedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No se puede anular una venta de SIM de un día de recargas que ya está cerrado.',
    );
  }
}

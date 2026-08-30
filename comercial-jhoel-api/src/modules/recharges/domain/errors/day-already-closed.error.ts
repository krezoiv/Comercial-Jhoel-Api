import { DomainError } from '../../../../shared/domain/domain-error';

export class DayAlreadyClosedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No se pueden registrar compras en un día que ya fue cerrado con saldo final.',
    );
  }
}

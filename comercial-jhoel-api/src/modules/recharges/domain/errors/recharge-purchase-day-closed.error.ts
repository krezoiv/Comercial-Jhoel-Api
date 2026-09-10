import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargePurchaseDayClosedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No se puede revertir una compra de un día de recargas que ya está cerrado.',
    );
  }
}

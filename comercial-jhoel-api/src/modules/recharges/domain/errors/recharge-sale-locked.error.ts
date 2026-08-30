import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeSaleLockedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Esta recarga ya no se puede modificar: el saldo de su operador para este cuadre ya fue cerrado.',
    );
  }
}

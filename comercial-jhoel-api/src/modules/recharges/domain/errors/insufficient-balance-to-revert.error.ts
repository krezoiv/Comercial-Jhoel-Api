import { DomainError } from '../../../../shared/domain/domain-error';

export class InsufficientBalanceToRevertError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No se puede revertir esta compra porque dejaría el saldo del operador en negativo.',
    );
  }
}

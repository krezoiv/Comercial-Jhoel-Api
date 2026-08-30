import { DomainError } from '../../../../shared/domain/domain-error';

export class FinalBalanceEditForbiddenError extends DomainError {
  readonly status = 403;

  constructor() {
    super(
      'Este día ya fue cerrado. Solo un administrador puede corregir el saldo final.',
    );
  }
}

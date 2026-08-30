import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidBankBalanceDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de operación no es válida.');
  }
}

export class InvalidBankFinalBalanceError extends DomainError {
  readonly status = 400;

  constructor(bankId: string) {
    super(`Saldo final inválido para el banco: ${bankId}`);
  }
}

export class NoBankBalancesToSaveError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debes ingresar al menos un saldo final para guardar.');
  }
}

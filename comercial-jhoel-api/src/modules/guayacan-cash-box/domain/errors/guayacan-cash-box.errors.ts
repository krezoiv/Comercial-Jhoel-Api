import { DomainError } from '../../../../shared/domain/domain-error';

export class GuayacanInvalidAmountError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El importe debe ser mayor que cero.');
  }
}

export class GuayacanInvalidConceptError extends DomainError {
  readonly status = 400;
  constructor() {
    super('Debe indicar el concepto del movimiento.');
  }
}

export class GuayacanInvalidDateError extends DomainError {
  readonly status = 400;
  constructor() {
    super('La fecha del movimiento no es válida (no puede ser futura).');
  }
}

export class GuayacanInsufficientBalanceError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El egreso supera el efectivo disponible en la Caja Guayacán.');
  }
}

export class GuayacanCashBreakdownMismatchError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El desglose de efectivo no coincide con el monto del movimiento.');
  }
}

export class GuayacanInvalidDenominationError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El desglose contiene una denominación o cantidad no válida.');
  }
}

export class GuayacanReasonRequiredError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El motivo es obligatorio (mínimo 5 caracteres).');
  }
}

export class GuayacanMovementNotFoundError extends DomainError {
  readonly status = 404;
  constructor(id: string) {
    super(`No se encontró el movimiento de caja ${id}.`);
  }
}

export class GuayacanMovementAlreadyVoidedError extends DomainError {
  readonly status = 400;
  constructor() {
    super('El movimiento ya está anulado.');
  }
}

/** Los movimientos de Transaccionar (y su historial) se corrigen anulando la operación en Transaccionar, nunca desde la caja. */
export class GuayacanMovementNotVoidableError extends DomainError {
  readonly status = 400;
  constructor() {
    super(
      'Este movimiento no se anula desde la caja: los depósitos y retiros de Transaccionar se revierten al anular su operación.',
    );
  }
}

export class GuayacanCountNotFoundError extends DomainError {
  readonly status = 404;
  constructor() {
    super('No se encontró el arqueo.');
  }
}

/** `RAISE EXCEPTION '<CODE>:...'` de las funciones de la caja → error de dominio. `null` si no es uno de ellos. */
export function guayacanCashBoxErrorFromMessage(
  message: string,
  movementId?: string,
): DomainError | null {
  const [code] = message.split(':');
  switch (code) {
    case 'INVALID_CASH_MOVEMENT_AMOUNT':
    case 'INVALID_CASH_MOVEMENT_TYPE':
      return new GuayacanInvalidAmountError();
    case 'INVALID_CASH_MOVEMENT_CONCEPT':
      return new GuayacanInvalidConceptError();
    case 'INVALID_CASH_MOVEMENT_DATE':
      return new GuayacanInvalidDateError();
    case 'CASH_BOX_INSUFFICIENT_BALANCE':
      return new GuayacanInsufficientBalanceError();
    case 'CASH_BREAKDOWN_MISMATCH':
      return new GuayacanCashBreakdownMismatchError();
    case 'INVALID_CASH_DENOMINATION':
      return new GuayacanInvalidDenominationError();
    case 'CASH_MOVEMENT_REASON_REQUIRED':
      return new GuayacanReasonRequiredError();
    case 'CASH_MOVEMENT_NOT_FOUND':
      return new GuayacanMovementNotFoundError(movementId ?? '');
    case 'CASH_MOVEMENT_ALREADY_VOIDED':
      return new GuayacanMovementAlreadyVoidedError();
    case 'CASH_MOVEMENT_NOT_VOIDABLE':
      return new GuayacanMovementNotVoidableError();
    default:
      return null;
  }
}

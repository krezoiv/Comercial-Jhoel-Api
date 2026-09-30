import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Errores de negocio de los movimientos de saldo bancario. Todas las reglas
 * viven en `apply_bank_account_movement`/`register_bank_transfer`/
 * `adjust_bank_balance` (migración `CreateBankAccountMovements`), que
 * levantan `RAISE EXCEPTION '<CODE>:<detalle>'`; `bankMovementErrorFromMessage`
 * traduce ese texto a uno de estos errores para que el usuario nunca vea un
 * error técnico de PostgreSQL. Compartido por `TypeOrmBankMovementRepository`
 * y `TypeOrmBankDepositRepository` (Transaccionar), así el mismo código de
 * SQL siempre produce el mismo mensaje sin importar qué módulo lo disparó.
 */

const INSUFFICIENT_BALANCE_MESSAGES: Record<string, string> = {
  DEPOSITO: 'Saldo insuficiente para realizar el depósito.',
  DESEMBOLSO_GENESIS: 'Saldo insuficiente para realizar el desembolso.',
  REINTEGRO: 'Saldo insuficiente para realizar el reintegro.',
  TRANSFERENCIA_SALIDA: 'Saldo insuficiente para realizar la transferencia.',
  RETIRO_EFECTIVO: 'Saldo insuficiente para realizar el retiro de efectivo.',
  AJUSTE_MANUAL:
    'El saldo de una cuenta bancaria no puede ser negativo (solo la línea de crédito de Fundación Génesis Empresarial lo permite).',
  ANULACION:
    'No es posible anular la operación: el saldo de la cuenta quedaría negativo.',
};

export class InsufficientBankBalanceError extends DomainError {
  readonly status = 400;

  constructor(readonly movementType: string) {
    super(
      INSUFFICIENT_BALANCE_MESSAGES[movementType] ??
        'Saldo insuficiente para realizar la operación.',
    );
  }
}

function formatLimit(value: string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return `Q${value}`;
  }
  return `Q${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export class BankBalanceLimitExceededError extends DomainError {
  readonly status = 400;

  constructor(
    movementType: string,
    specialAccount: string,
    maxBalance: string,
    bankName: string,
  ) {
    const limit = formatLimit(maxBalance);
    if (specialAccount === 'GENESIS' && movementType === 'PAGO_GENESIS') {
      super(
        `El pago excede el límite máximo permitido de ${limit} para la línea de crédito de Fundación Génesis Empresarial.`,
      );
    } else if (specialAccount === 'BI_CLUB') {
      super(
        `El saldo de BI Club Empresarial no puede superar el límite configurado de ${limit}.`,
      );
    } else {
      super(
        `El saldo de ${bankName} no puede superar el límite configurado de ${limit}.`,
      );
    }
  }
}

/**
 * Línea de crédito de BI Club Empresarial — modelo vigente
 * (`BiClubAvailableCredit`, 1760005900000): saldo = −disponible
 * (−Q75,000 = todo disponible, Q0.00 = agotada). Una anulación o un ajuste
 * que rompería el rango se explica aparte, porque el usuario no está
 * "usando" ni "pagando" nada.
 */
export class CreditLineNoAvailableError extends DomainError {
  readonly status = 400;

  constructor(movementType: string) {
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: la línea de crédito de BI Club Empresarial quedaría sin disponible (saldo positivo).'
        : movementType === 'AJUSTE_MANUAL'
          ? 'El saldo de BI Club Empresarial no puede ser positivo (Q0.00 = línea agotada).'
          : 'La línea de crédito de BI Club Empresarial no tiene disponible (saldo Q0.00).',
    );
  }
}

export class CreditLineAvailableExceededError extends DomainError {
  readonly status = 400;

  constructor(movementType: string, available: string) {
    const amount = Number(available);
    const detail = Number.isNaN(amount)
      ? ''
      : ` Disponible: Q${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: excedería el disponible de la línea de crédito de BI Club Empresarial.'
        : movementType === 'AJUSTE_MANUAL'
          ? 'El saldo de BI Club Empresarial no puede ser positivo (Q0.00 = línea agotada).'
          : `El monto excede el disponible de la línea de crédito de BI Club Empresarial.${detail}`,
    );
  }
}

export class CreditLinePaymentExceededError extends DomainError {
  readonly status = 400;

  constructor(movementType: string) {
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: el disponible de BI Club Empresarial superaría el límite de la línea.'
        : movementType === 'AJUSTE_MANUAL'
          ? 'El saldo de BI Club Empresarial no puede ser menor que el límite negativo de la línea.'
          : 'El pago excede el monto utilizado de la línea de crédito de BI Club Empresarial.',
    );
  }
}

/**
 * Códigos del modelo anterior (1760005700000/1760005800000) — solo los
 * levanta la versión de las funciones que restaura un `down()`.
 */
export class CreditLineLimitExceededError extends DomainError {
  readonly status = 400;

  constructor(movementType: string) {
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: la línea de crédito de BI Club Empresarial excedería su límite.'
        : 'El monto excede el límite disponible de la línea de crédito de BI Club Empresarial.',
    );
  }
}

export class CreditLineNoDebtError extends DomainError {
  readonly status = 400;

  constructor(movementType: string) {
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: la línea de crédito de BI Club Empresarial quedaría con saldo positivo.'
        : 'No existe saldo pendiente para realizar esta devolución.',
    );
  }
}

export class CreditLineOverpaymentError extends DomainError {
  readonly status = 400;

  constructor(movementType: string) {
    super(
      movementType === 'ANULACION'
        ? 'No es posible anular la operación: la línea de crédito de BI Club Empresarial quedaría con saldo positivo.'
        : 'El monto de devolución excede el saldo pendiente de la línea de crédito.',
    );
  }
}

export class LegacyCreditLineTransferError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Esta transferencia de BI Club Empresarial se registró con una regla de saldo anterior y no puede anularse automáticamente. Corrija el saldo con "Ajustar saldo".',
    );
  }
}

export class TransferOriginNotAllowedError extends DomainError {
  readonly status = 400;

  constructor(destination: string) {
    super(
      destination === 'DISTRICOL'
        ? 'Solo Banco Agromercantil puede transferir a Districol.'
        : 'Solo Banco Industrial puede transferir a BI Club Empresarial.',
    );
  }
}

export class TransferDestinationNotAllowedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('BI Club Empresarial solo puede transferir a Banco Industrial.');
  }
}

export class BankTransferDestinationRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Seleccione la cuenta destino o "Retiro de efectivo en banco".');
  }
}

export class SameAccountTransferError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La cuenta de origen y la de destino deben ser distintas.');
  }
}

export class InvalidMovementAmountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El monto debe ser mayor que cero.');
  }
}

export class BankBalanceUnchangedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El nuevo saldo es igual al saldo actual; no hay nada que ajustar.');
  }
}

export class MovementReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar el motivo.');
  }
}

export class BankBalanceCreditNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`Acreditación de saldo no encontrada: ${id}`);
  }
}

export class BankBalanceCreditAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Esta acreditación de saldo ya fue anulada.');
  }
}

export class BankTransferNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`Transferencia no encontrada: ${id}`);
  }
}

export class BankTransferAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Esta transferencia ya fue anulada.');
  }
}

export class GenesisAccountNotConfiguredError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'No hay una cuenta activa configurada como línea de crédito de Fundación Génesis Empresarial (Sistema → Bancos).',
    );
  }
}

export class BankAccountRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe seleccionar la cuenta bancaria afectada por esta operación.');
  }
}

export class BankBalanceRequiresAdjustmentError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El saldo actual de una cuenta solo puede modificarse con "Ajustar saldo" (Agentes Bancarios → Bancos), que exige un motivo y queda auditado.',
    );
  }
}

export class SpecialAccountAlreadyAssignedError extends DomainError {
  readonly status = 409;

  constructor() {
    super(
      'Ya existe otra cuenta activa con esa regla especial (Génesis, BI Club o Districol solo pueden asignarse a una cuenta).',
    );
  }
}

export class BankAccountNotAvailableError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'La cuenta seleccionada no está habilitada para Transaccionar (Sistema → Bancos).',
    );
  }
}

export class ReintegroSourceIsGenesisError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El reintegro abona a la línea de crédito de Fundación Génesis Empresarial: seleccione la cuenta desde la que se paga.',
    );
  }
}

/**
 * `null` cuando el mensaje no corresponde a ninguna regla de saldos —
 * el llamador decide entonces cómo traducirlo (o re-lanzarlo tal cual).
 * Los códigos de cuenta no encontrada/inactiva se dejan al llamador: cada
 * módulo ya tiene su propio error para eso.
 */
export function bankMovementErrorFromMessage(
  message: string,
): DomainError | null {
  const [code, ...details] = message.split(':');
  switch (code) {
    case 'INSUFFICIENT_BALANCE':
      return new InsufficientBankBalanceError(details[0] ?? '');
    case 'BALANCE_LIMIT_EXCEEDED':
      return new BankBalanceLimitExceededError(
        details[0] ?? '',
        details[1] ?? '',
        details[2] ?? '',
        details.slice(3).join(':'),
      );
    case 'CREDIT_LINE_NO_AVAILABLE':
      return new CreditLineNoAvailableError(details[0] ?? '');
    case 'CREDIT_LINE_AVAILABLE_EXCEEDED':
      return new CreditLineAvailableExceededError(
        details[0] ?? '',
        details[1] ?? '',
      );
    case 'CREDIT_LINE_PAYMENT_EXCEEDED':
      return new CreditLinePaymentExceededError(details[0] ?? '');
    case 'CREDIT_LINE_LIMIT_EXCEEDED':
      return new CreditLineLimitExceededError(details[0] ?? '');
    case 'CREDIT_LINE_NO_DEBT':
      return new CreditLineNoDebtError(details[0] ?? '');
    case 'CREDIT_LINE_OVERPAYMENT':
      return new CreditLineOverpaymentError(details[0] ?? '');
    case 'LEGACY_CREDIT_LINE_TRANSFER':
      return new LegacyCreditLineTransferError();
    case 'TRANSFER_ORIGIN_NOT_ALLOWED':
      return new TransferOriginNotAllowedError(details[0] ?? '');
    case 'TRANSFER_DESTINATION_NOT_ALLOWED':
      return new TransferDestinationNotAllowedError();
    case 'SAME_ACCOUNT_TRANSFER':
      return new SameAccountTransferError();
    case 'INVALID_MOVEMENT_AMOUNT':
      return new InvalidMovementAmountError();
    case 'BALANCE_UNCHANGED':
      return new BankBalanceUnchangedError();
    case 'REASON_REQUIRED':
      return new MovementReasonRequiredError();
    case 'TRANSFER_ALREADY_VOIDED':
      return new BankTransferAlreadyVoidedError();
    case 'BALANCE_CREDIT_NOT_FOUND':
      return new BankBalanceCreditNotFoundError(details[0] ?? '');
    case 'BALANCE_CREDIT_ALREADY_VOIDED':
      return new BankBalanceCreditAlreadyVoidedError();
    case 'GENESIS_ACCOUNT_NOT_CONFIGURED':
      return new GenesisAccountNotConfiguredError();
    case 'BANK_ACCOUNT_REQUIRED':
      return new BankAccountRequiredError();
    case 'BANK_ACCOUNT_NOT_AVAILABLE':
      return new BankAccountNotAvailableError();
    case 'REINTEGRO_SOURCE_IS_GENESIS':
      return new ReintegroSourceIsGenesisError();
    default:
      return null;
  }
}

export class BankOperationDayNotOpenedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `Debe aperturar el día ${date} (Agentes Bancarios → Bancos) antes de registrar operaciones bancarias.`,
    );
  }
}

export class BankOperationDayClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `El día ${date} ya fue cerrado; no se pueden registrar más operaciones bancarias.`,
    );
  }
}

export class InvalidBankMovementDateRangeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha inicial no puede ser posterior a la fecha final.');
  }
}

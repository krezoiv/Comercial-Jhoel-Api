import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Business-rule violation of the "Cancelar cuenta(s) por cobrar" feature.
 * One class with the stable `code` the SQL functions `RAISE` (same pattern as
 * `CashControlRuleError`): the rules live in PostgreSQL, this only carries
 * their user-facing message and HTTP status.
 */
export class AccountReceivableSettlementError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  AR_SETTLEMENT_FORBIDDEN: {
    message: 'No tiene permiso para cancelar o anular cobros.',
    status: 403,
  },
  AR_SETTLEMENT_IDEMPOTENCY_KEY_REQUIRED: {
    message: 'Falta el identificador de la solicitud.',
  },
  AR_SETTLEMENT_IDEMPOTENCY_CONFLICT: {
    message: 'El identificador de la solicitud ya se usó para otro cliente.',
    status: 409,
  },
  AR_SETTLEMENT_INVALID_METHOD: {
    message: 'Seleccione si el pago fue en efectivo o por depósito bancario.',
  },
  AR_SETTLEMENT_CLIENT_NOT_FOUND: {
    message: 'No se encontró el cliente.',
    status: 404,
  },
  AR_SETTLEMENT_ITEMS_REQUIRED: {
    message: 'Seleccione al menos una cuenta por cobrar.',
  },
  AR_SETTLEMENT_TOO_MANY_ITEMS: {
    message: 'Se pueden cancelar como máximo 200 cuentas por operación.',
  },
  AR_SETTLEMENT_DUPLICATE_ITEM: {
    message: 'Una cuenta aparece más de una vez en la selección.',
  },
  AR_SETTLEMENT_BANK_REQUIRED: {
    message: 'Seleccione la cuenta bancaria que recibió el depósito.',
  },
  AR_SETTLEMENT_BANK_NOT_ALLOWED: {
    message:
      'Un pago en efectivo no lleva cuenta bancaria ni referencia de depósito.',
  },
  AR_SETTLEMENT_INVALID_BANK: {
    message: 'La cuenta bancaria no existe o está inactiva.',
  },
  AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED: {
    message:
      'La cuenta de Cooperativa Guayacán no recibe depósitos: su saldo es el de su propia caja.',
  },
  AR_SETTLEMENT_ACCOUNT_NOT_FOUND: {
    message: 'Una de las cuentas por cobrar no existe.',
    status: 404,
  },
  AR_SETTLEMENT_MIXED_CLIENTS: {
    message:
      'Todas las cuentas deben pertenecer al mismo cliente. Finalice o limpie la selección actual.',
  },
  AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE: {
    message:
      'Solo se pueden cancelar cargos activos (no abonos ni registros desactivados).',
  },
  AR_SETTLEMENT_ALREADY_SETTLED: {
    message:
      'Una de las cuentas ya está cancelada. Actualice la lista e intente de nuevo.',
    status: 409,
  },
  AR_SETTLEMENT_PARTIAL_NOT_ALLOWED: {
    message:
      'En una cancelación de varias cuentas cada cuenta se cancela por su saldo completo.',
  },
  AR_SETTLEMENT_INVALID_AMOUNT: { message: 'El monto recibido no es válido.' },
  AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING: {
    message: 'El monto recibido no puede ser mayor al saldo pendiente.',
  },
  AR_SETTLEMENT_TOTAL_MISMATCH: {
    message:
      'Los saldos cambiaron desde que abrió el resumen. Revise los montos y confirme de nuevo.',
    status: 409,
  },
  AR_SETTLEMENT_CASH_NOT_RECORDED: {
    message: 'No se pudo registrar la entrada de efectivo.',
    status: 500,
  },
  AR_SETTLEMENT_REASON_REQUIRED: {
    message: 'El motivo es obligatorio (mínimo 5 caracteres).',
  },
  AR_SETTLEMENT_NOT_FOUND: {
    message: 'No se encontró la operación de cobro.',
    status: 404,
  },
  AR_SETTLEMENT_ALREADY_VOIDED: {
    message: 'La operación de cobro ya está anulada.',
    status: 409,
  },
  AR_PAYMENT_ROW_LOCKED: {
    message:
      'Este abono pertenece a una operación de cobro: para corregirlo, anule la operación.',
    status: 409,
  },
  AR_CHARGE_HAS_PAYMENTS: {
    message:
      'La cuenta ya tiene pagos registrados: no se puede desactivar, cambiar de cliente ni bajar su monto por debajo de lo pagado. Anule primero el cobro.',
    status: 409,
  },
  ABONO_EXCEEDS_BALANCE: {
    message: 'El abono no puede ser mayor al saldo pendiente del cliente.',
  },
};

export function settlementError(
  code: string,
): AccountReceivableSettlementError {
  const entry = MESSAGES[code] ?? {
    message: 'Operación de cobro no válida.',
  };
  return new AccountReceivableSettlementError(
    code,
    entry.message,
    entry.status ?? 400,
  );
}

/** `RAISE EXCEPTION '<CODE>'` from the settlement SQL → domain error; `null` if it is not one of them. */
export function settlementErrorFromMessage(
  message: string,
): AccountReceivableSettlementError | null {
  const [code] = message.split(':');
  return MESSAGES[code] ? settlementError(code) : null;
}

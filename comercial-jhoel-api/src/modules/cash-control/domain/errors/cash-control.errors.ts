import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Business-rule violation of Control de Efectivo. One class with a stable
 * `code` (the same code the SQL functions `RAISE`) instead of one class per
 * rule: the rules live in SQL, this only carries their user-facing message
 * and HTTP status through `GlobalExceptionFilter`.
 */
export class CashControlRuleError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  CASH_IDEMPOTENCY_KEY_REQUIRED: {
    message: 'Falta el identificador de la solicitud.',
  },
  CASH_INVALID_AMOUNT: { message: 'El importe no es válido.' },
  CASH_INVALID_DIRECTION: {
    message: 'La dirección del movimiento no es válida.',
  },
  CASH_INVALID_MOVEMENT_TYPE: {
    message: 'El tipo de movimiento no es válido.',
  },
  CASH_REASON_REQUIRED: {
    message: 'El motivo es obligatorio (mínimo 5 caracteres).',
  },
  CASH_INITIAL_BALANCE_EXISTS: {
    message:
      'El saldo inicial de efectivo ya fue registrado. Para corregirlo, anúlelo o registre un ajuste.',
    status: 409,
  },
  CASH_MOVEMENT_NOT_FOUND: {
    message: 'No se encontró el movimiento de efectivo.',
    status: 404,
  },
  CASH_MOVEMENT_ALREADY_VOIDED: { message: 'El movimiento ya está anulado.' },
  CASH_MOVEMENT_NOT_VOIDABLE: {
    message:
      'Este movimiento se anula desde su módulo de origen (Transaccionar, Cartera o Transferencias Bancarias); la reversa llega sola al Kardex.',
  },
  CASH_DAY_NOT_FOUND: {
    message: 'No se encontró el día operativo de efectivo.',
    status: 404,
  },
  CASH_DAY_NOT_OPENED: {
    message: 'Primero debe abrir el día operativo de efectivo.',
  },
  CASH_DAY_LATER_EXISTS: {
    message:
      'Ya existe un día operativo posterior; no se puede abrir una fecha anterior.',
    status: 409,
  },
  CASH_DAY_ALREADY_CLOSED: {
    message: 'El día operativo de efectivo ya está cerrado.',
    status: 409,
  },
  CASH_DAY_CUTS_PENDING: {
    message:
      'El día solo puede cerrarse después de finalizar el primer y el segundo corte.',
  },
  CASH_CUT_NOT_FOUND: { message: 'No se encontró el corte.', status: 404 },
  CASH_CUT_ANOTHER_OPEN: {
    message: 'Ya hay un corte abierto. Finalícelo antes de continuar.',
    status: 409,
  },
  CASH_CUT_ALREADY_STARTED: {
    message: 'Este corte ya fue iniciado.',
    status: 409,
  },
  CASH_CUT_ALREADY_FINISHED: {
    message: 'Este corte ya está finalizado.',
    status: 409,
  },
  CASH_CUT_NOT_OPEN: {
    message: 'Solo se puede finalizar un corte que esté abierto.',
  },
  CASH_CUT_NOT_FINISHED: {
    message: 'Solo se puede reabrir un corte finalizado.',
  },
  CASH_CUT_FIRST_NOT_FINISHED: {
    message:
      'El segundo corte no puede comenzar antes de finalizar el primero.',
  },
  CASH_CUT_LATER_EXISTS: {
    message:
      'Solo se puede reabrir el último corte: ya existe un corte o día posterior que heredó sus saldos.',
    status: 409,
  },
  CASH_CUT_INVALID_SCHEDULE: {
    message: 'La hora de finalización debe ser posterior a la hora de inicio.',
  },
  CASH_CUT_SCHEDULE_OVERLAP: {
    message:
      'Los horarios del primer y del segundo corte no pueden superponerse.',
  },
  CASH_INVALID_DENOMINATION: {
    message: 'El conteo contiene una denominación o cantidad no válida.',
  },
  CASH_CUT_INVALID_BANK: {
    message:
      'La conciliación contiene un banco inactivo, repetido o sin saldo verificado.',
  },
  CASH_CUT_BANKS_INCOMPLETE: {
    message: 'Debe verificar el saldo de todas las cuentas bancarias activas.',
  },
  CASH_BREAKDOWN_REQUIRED: {
    message:
      'El depósito bancario requiere el desglose del efectivo por denominación.',
  },
  CASH_BREAKDOWN_MISMATCH: {
    message: 'El desglose del efectivo no coincide con el monto del depósito.',
  },
  CASH_INSUFFICIENT_BALANCE: {
    message: 'El efectivo disponible en caja no alcanza para este depósito.',
  },
  CASH_DEPOSIT_INVALID_BANK: {
    message: 'Seleccione una cuenta bancaria activa.',
  },
  CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED: {
    message:
      'La cuenta de Cooperativa Guayacán no recibe depósitos desde esta caja: su saldo es el de su propia caja.',
  },
  CASH_INVALID_DATE_RANGE: {
    message: 'La fecha inicial no puede ser posterior a la fecha final.',
  },
  CASH_FORBIDDEN: {
    message: 'No tienes permisos para realizar esta acción.',
    status: 403,
  },
  CASH_MANUAL_OPENING_FORBIDDEN: {
    message:
      'Solo un administrador puede autorizar un saldo de apertura distinto del heredado.',
    status: 403,
  },
};

/** Builds the domain error for a known rule code. */
export function cashControlError(code: string): CashControlRuleError {
  const entry = MESSAGES[code] ?? {
    message: 'Operación de efectivo no válida.',
  };
  return new CashControlRuleError(code, entry.message, entry.status ?? 400);
}

/** `RAISE EXCEPTION '<CODE>'` from the cash SQL functions → domain error; `null` if it is not one of them. */
export function cashControlErrorFromMessage(
  message: string,
): CashControlRuleError | null {
  const [code] = message.split(':');
  return MESSAGES[code] ? cashControlError(code) : null;
}

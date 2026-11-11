import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Business-rule violation of "Revisión de días operativos". The rules live in
 * PostgreSQL (`RAISE EXCEPTION '<CODE>:<detail>'`); this carries the stable
 * code, its user-facing message and HTTP status.
 */
export class FinancialDayReviewError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  FINANCIAL_REVIEW_FORBIDDEN: {
    message:
      'No tiene el permiso administrativo necesario para revisar o corregir días operativos.',
    status: 403,
  },
  FINANCIAL_REVIEW_REASON_REQUIRED: {
    message: 'El motivo es obligatorio (mínimo 5 caracteres).',
  },
  FINANCIAL_REVIEW_REQUEST_ID_REQUIRED: {
    message: 'Falta el identificador de la solicitud.',
  },
  FINANCIAL_REVIEW_IDEMPOTENCY_CONFLICT: {
    message: 'El identificador de la solicitud ya se usó en otra revisión.',
    status: 409,
  },
  FINANCIAL_REVIEW_INVALID_DATE: { message: 'La fecha no es válida.' },
  FINANCIAL_REVIEW_DATE_NOT_HISTORICAL: {
    message:
      'Solo se pueden revisar días anteriores a hoy. El día actual se corrige con sus herramientas normales.',
  },
  FINANCIAL_REVIEW_DAY_NOT_FOUND: {
    message: 'Ese día no tiene datos operativos registrados.',
    status: 404,
  },
  FINANCIAL_REVIEW_DAY_STILL_OPEN: {
    message:
      'Ese día sigue abierto en Agentes Bancarios o en Control de Efectivo. Ciérrelo por su flujo normal antes de revisarlo.',
    status: 409,
  },
  FINANCIAL_REVIEW_ALREADY_OPEN: {
    message: 'Ese día ya está en revisión.',
    status: 409,
  },
  FINANCIAL_REVIEW_SESSION_NOT_FOUND: {
    message: 'No se encontró la sesión de revisión.',
    status: 404,
  },
  FINANCIAL_REVIEW_SESSION_CLOSED: {
    message: 'La sesión de revisión ya está cerrada: no admite cambios.',
    status: 409,
  },
  FINANCIAL_REVIEW_NOT_OWNER: {
    message:
      'Solo el usuario que abrió la revisión puede registrar correcciones en ella.',
    status: 403,
  },
  FINANCIAL_REVIEW_INVALID_TARGET: {
    message: 'Ese tipo de registro no se puede corregir desde la revisión.',
  },
  FINANCIAL_REVIEW_INVALID_FIELD: {
    message: 'Ese dato no se puede corregir desde la revisión.',
  },
  FINANCIAL_REVIEW_INVALID_VALUE: {
    message: 'El valor corregido no es válido.',
  },
  FINANCIAL_REVIEW_TARGET_NOT_FOUND: {
    message: 'No se encontró el registro a corregir.',
    status: 404,
  },
  FINANCIAL_REVIEW_TARGET_NOT_CORRECTABLE: {
    message:
      'Ese registro no tiene un valor que se pueda corregir (por ejemplo, un arqueo reemplazado).',
  },
  FINANCIAL_REVIEW_OUTSIDE_DAY: {
    message:
      'El registro pertenece a otro día. Una revisión solo corrige datos del día seleccionado.',
    status: 409,
  },
  FINANCIAL_REVIEW_DAY_LOCKED: {
    message:
      'Ese día está en revisión histórica: sus datos no se pueden modificar por el flujo normal hasta cerrar la revisión.',
    status: 409,
  },
  FINANCIAL_REVIEW_NO_CHANGE: {
    message: 'El valor corregido es igual al valor actual.',
  },
  FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE: {
    message:
      'Ese movimiento está anulado o es una anulación: corrija el movimiento original vigente.',
  },
  FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE: {
    message:
      'Ese renglón lo generó otra operación (transacción, cuenta por cobrar, activo o depósito). Corrija el registro de origen para que todos sus efectos queden consistentes.',
    status: 409,
  },
  FINANCIAL_REVIEW_CONFIRMATION_REQUIRED: {
    message: 'Revise el resumen de cierre antes de confirmar.',
    status: 409,
  },
  FINANCIAL_REVIEW_PENDING_DIFFERENCES: {
    message:
      'Quedan diferencias sin resolver. Confirme explícitamente que cierra la revisión con diferencias pendientes.',
    status: 409,
  },
  FINANCIAL_REVIEW_AUDIT_IMMUTABLE: {
    message: 'La auditoría de correcciones no se puede modificar ni eliminar.',
    status: 409,
  },
};

/** Builds the domain error for a known code (with an optional extra detail). */
export function financialDayReviewError(
  code: string,
  detail?: string,
): FinancialDayReviewError {
  const entry = MESSAGES[code] ?? {
    message: 'Operación de revisión no válida.',
  };
  let message = entry.message;
  if (code === 'FINANCIAL_REVIEW_ALREADY_OPEN' && detail) {
    const [username, openedAt] = detail.split('|');
    message = `Ese día ya está en revisión por ${username} (abierta el ${openedAt}).`;
  }
  return new FinancialDayReviewError(code, message, entry.status ?? 400);
}

/** `RAISE EXCEPTION '<CODE>:<detail>'` → domain error; `null` if it is not one of ours. */
export function financialDayReviewErrorFromMessage(
  message: string,
): FinancialDayReviewError | null {
  const separator = message.indexOf(':');
  const code = separator < 0 ? message : message.slice(0, separator);
  const detail = separator < 0 ? undefined : message.slice(separator + 1);
  return MESSAGES[code] ? financialDayReviewError(code, detail) : null;
}

import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Business rules of the commercial life cycle and "Confirmar venta"
 * (migration 1760008200000). One class with the stable `code` the SQL
 * functions RAISE, carrying the user-facing message and HTTP status.
 */
export class QuotationRuleError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  QUOTATION_NOT_FOUND: {
    message: 'No se encontró la cotización.',
    status: 404,
  },
  QUOTATION_INVALID_CUSTOMER_NAME: {
    message: 'El nombre del cliente debe tener entre 3 y 150 caracteres.',
  },
  QUOTATION_INVALID_PHONE: {
    message:
      'El número de teléfono del cliente no es válido (mínimo 8 dígitos).',
  },
  QUOTATION_REASON_REQUIRED: {
    message: 'El motivo es obligatorio (mínimo 5 caracteres).',
  },
  QUOTATION_ALREADY_SOLD: {
    message:
      'La cotización ya fue vendida; para revertirla anule primero la venta en Ventas.',
    status: 409,
  },
  QUOTATION_ALREADY_VOIDED: {
    message: 'La cotización ya está cancelada.',
    status: 409,
  },
  QUOTATION_EXPIRED: {
    message:
      'La cotización está vencida; genere una nueva para respetar los precios vigentes.',
    status: 409,
  },
  QUOTATION_INVALID_TRANSITION: {
    message:
      'La acción no está permitida en el estado actual de la cotización.',
    status: 409,
  },
  QUOTATION_NOT_SELLABLE: {
    message:
      'Solo una cotización cotizada o aceptada se puede convertir en venta.',
    status: 409,
  },
  QUOTATION_INSUFFICIENT_STOCK: {
    message:
      'No hay existencias suficientes en Vitrina para confirmar la venta.',
    status: 409,
  },
  QUOTATION_PRODUCT_INACTIVE: {
    message: 'Un producto de la cotización está desactivado.',
    status: 409,
  },
  LOCATION_NOT_FOUND: {
    message: 'No existe la ubicación de inventario "Vitrina".',
    status: 500,
  },
};

const STATUS_LABEL: Record<string, string> = {
  BORRADOR: 'borrador',
  RECHAZADA: 'rechazada',
  CANCELADA: 'cancelada',
  VENDIDA: 'vendida',
};

const DETAILED: Record<string, (parts: string[]) => string | null> = {
  // QUOTATION_INSUFFICIENT_STOCK:<available>:<requested>:<product name>
  QUOTATION_INSUFFICIENT_STOCK: ([available, requested, ...name]) =>
    name.length
      ? `No hay existencias suficientes de "${name.join(':')}" en Vitrina: disponibles ${available}, se necesitan ${requested}.`
      : null,
  QUOTATION_PRODUCT_INACTIVE: (name) =>
    name.length
      ? `El producto "${name.join(':')}" está desactivado; no se puede vender.`
      : null,
  QUOTATION_NOT_SELLABLE: ([status]) =>
    STATUS_LABEL[status]
      ? `La cotización está ${STATUS_LABEL[status]}; solo una cotizada o aceptada se convierte en venta.`
      : null,
  QUOTATION_INVALID_TRANSITION: ([status]) =>
    STATUS_LABEL[status]
      ? `La acción no está permitida: la cotización está ${STATUS_LABEL[status]}.`
      : null,
};

export function quotationRuleError(code: string): QuotationRuleError {
  const entry = MESSAGES[code] ?? { message: 'La operación no es válida.' };
  return new QuotationRuleError(code, entry.message, entry.status ?? 400);
}

/** Maps `RAISE EXCEPTION 'CODE[:detail…]'`; null when the code is not one of these rules. */
export function quotationRuleErrorFromMessage(
  message: string,
): QuotationRuleError | null {
  const [code, ...parts] = message.split(':');
  if (!MESSAGES[code]) {
    return null;
  }
  const detailed = DETAILED[code]?.(parts);
  return detailed
    ? new QuotationRuleError(code, detailed, MESSAGES[code].status ?? 400)
    : quotationRuleError(code);
}

import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Business-rule violation of Listas Escolares. One class with a stable `code`
 * (the same code the SQL functions `RAISE`), carrying its user-facing message
 * and HTTP status through `GlobalExceptionFilter`.
 */
export class SchoolListRuleError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  SCHOOL_LIST_FORBIDDEN: {
    message: 'No tiene permiso para realizar esta acción en Listas Escolares.',
    status: 403,
  },
  SCHOOL_IDEMPOTENCY_KEY_REQUIRED: {
    message: 'Falta el identificador de la solicitud.',
  },
  SCHOOL_IDEMPOTENCY_CONFLICT: {
    message: 'El identificador de la solicitud ya se usó en otra cotización.',
    status: 409,
  },
  SCHOOL_VERSION_CONFLICT: {
    message:
      'Otro usuario modificó este registro mientras lo editaba. Recargue para ver la versión actual.',
    status: 409,
  },
  SCHOOL_RECORD_IMMUTABLE: {
    message:
      'Los pagos y el historial no se modifican ni se eliminan; use una reversa auditada.',
    status: 409,
  },
  SCHOOL_INVALID_TEMPLATE_NAME: {
    message: 'El nombre de la plantilla debe tener entre 3 y 120 caracteres.',
  },
  SCHOOL_INVALID_GRADE: {
    message: 'El grado escolar debe tener entre 3 y 60 caracteres.',
  },
  SCHOOL_TEMPLATE_NAME_TAKEN: {
    message: 'Ya existe una plantilla con ese nombre.',
    status: 409,
  },
  SCHOOL_TEMPLATE_NOT_FOUND: {
    message: 'No se encontró la plantilla.',
    status: 404,
  },
  SCHOOL_TEMPLATE_INACTIVE: {
    message: 'La plantilla está desactivada; actívela para cotizar con ella.',
    status: 409,
  },
  SCHOOL_INVALID_TEMPLATE_ITEM: {
    message:
      'Un producto ya no pertenece a la plantilla (fue modificada). Recargue la lista.',
    status: 409,
  },
  SCHOOL_INVALID_ITEMS: { message: 'La lista de productos no es válida.' },
  SCHOOL_INVALID_PRODUCT_NAME: {
    message: 'Cada producto necesita un nombre de 2 a 150 caracteres.',
  },
  SCHOOL_INVALID_QUANTITY: {
    message: 'La cantidad debe ser un número entero entre 1 y 9,999.',
  },
  SCHOOL_INVALID_PRICE: {
    message:
      'El precio debe ser mayor o igual a cero, con dos decimales como máximo.',
  },
  SCHOOL_INVALID_DISCOUNT: {
    message:
      'El descuento no puede ser negativo ni mayor al subtotal de la línea.',
  },
  SCHOOL_PRODUCT_NOT_FOUND: {
    message: 'Un producto del inventario no existe.',
    status: 404,
  },
  SCHOOL_PRODUCT_INACTIVE: {
    message: 'Un producto del inventario está desactivado.',
    status: 409,
  },
  SCHOOL_PRICE_OVERRIDE_FORBIDDEN: {
    message:
      'Su rol no puede cambiar precios ni aplicar descuentos; solicítelo a un supervisor o administrador.',
    status: 403,
  },
  SCHOOL_QUOTE_EMPTY: {
    message: 'La cotización debe tener al menos un producto.',
  },
  SCHOOL_QUOTE_TOTAL_ZERO: {
    message: 'El total de la cotización debe ser mayor que cero.',
  },
  SCHOOL_INVALID_CUSTOMER_NAME: {
    message:
      'El nombre del cliente o encargado debe tener entre 3 y 150 caracteres.',
  },
  SCHOOL_INVALID_PHONE: {
    message: 'El número de teléfono no es válido (mínimo 8 dígitos).',
  },
  SCHOOL_INVALID_TEXT: { message: 'Un texto excede la longitud permitida.' },
  SCHOOL_INVALID_DELIVERY_DATE: {
    message:
      'La fecha de entrega no puede ser anterior a la fecha de cotización.',
  },
  SCHOOL_INVALID_DATE_RANGE: {
    message: 'La fecha inicial no puede ser posterior a la fecha final.',
  },
  SCHOOL_QUOTE_NOT_FOUND: {
    message: 'No se encontró la cotización.',
    status: 404,
  },
  SCHOOL_QUOTE_NOT_EDITABLE: {
    message: 'La cotización ya no se puede modificar.',
    status: 409,
  },
  SCHOOL_QUOTE_TOTAL_BELOW_PAID: {
    message: 'El nuevo total no puede ser menor a lo que el cliente ya pagó.',
    status: 409,
  },
  SCHOOL_QUOTE_DRAFT_NO_PAYMENTS: {
    message: 'Un borrador no recibe pagos; confirme la cotización primero.',
    status: 409,
  },
  SCHOOL_QUOTE_CLOSED: {
    message: 'La cotización está cerrada y no admite esta operación.',
    status: 409,
  },
  SCHOOL_QUOTE_INVALID_TRANSITION: {
    message:
      'La acción no está permitida en el estado actual de la cotización.',
    status: 409,
  },
  SCHOOL_QUOTE_NOT_PAID: {
    message: 'La cotización tiene saldo pendiente; no se puede entregar.',
    status: 409,
  },
  SCHOOL_INVALID_AMOUNT: {
    message: 'El monto debe ser mayor que cero, con dos decimales como máximo.',
  },
  SCHOOL_INVALID_PAYMENT_METHOD: {
    message: 'El método de pago no es válido.',
  },
  SCHOOL_BANK_NOT_FOUND: {
    message: 'La cuenta bancaria no existe o está inactiva.',
    status: 404,
  },
  SCHOOL_PAYMENT_EXCEEDS_BALANCE: {
    message: 'El pago supera el saldo pendiente.',
    status: 409,
  },
  SCHOOL_PAYMENT_NOT_FOUND: {
    message: 'No se encontró el pago.',
    status: 404,
  },
  SCHOOL_PAYMENT_NOT_VOIDABLE: {
    message: 'Solo se anulan anticipos y abonos.',
    status: 409,
  },
  SCHOOL_PAYMENT_ALREADY_VOIDED: {
    message: 'El pago ya está anulado.',
    status: 409,
  },
  SCHOOL_REASON_REQUIRED: {
    message: 'El motivo es obligatorio (mínimo 5 caracteres).',
  },
  SCHOOL_USE_DISPATCH: {
    message: 'La entrega se registra con "Preparar y despachar lista".',
    status: 409,
  },
  SCHOOL_SUPPLY_INCOMPLETE: {
    message: 'La lista todavía tiene productos pendientes de abastecimiento.',
    status: 409,
  },
  SCHOOL_SUPPLY_OVER_PENDING: {
    message: 'No se puede asignar más de lo que la lista tiene pendiente.',
    status: 409,
  },
  SCHOOL_SUPPLY_NO_FREE_UNITS: {
    message: 'No hay unidades libres en Bodega para asignar.',
    status: 409,
  },
  SCHOOL_SUPPLY_PURCHASE_EXHAUSTED: {
    message: 'Las unidades de esa compra ya fueron asignadas.',
    status: 409,
  },
  SCHOOL_PURCHASE_NOT_FOUND: {
    message: 'No se encontró la compra o no incluye ese producto.',
    status: 404,
  },
  SCHOOL_INVALID_SUPPLY_MODE: {
    message: 'El modo de asignación no es válido.',
  },
  SCHOOL_INSUFFICIENT_STOCK: {
    message: 'No hay existencias suficientes en Bodega para guardar la lista.',
    status: 409,
  },
  SCHOOL_LOCATION_NOT_FOUND: {
    message: 'No existe la ubicación de inventario "Bodega".',
    status: 500,
  },
  SCHOOL_REQUIREMENT_WITH_PRODUCT: {
    message:
      'Los requerimientos de la lista son texto libre; el producto de inventario se elige al preparar el pedido.',
  },
  SCHOOL_PREPARATION_NOT_APPLICABLE: {
    message:
      'Esta lista usa el flujo anterior (descontó inventario al confirmarse); no tiene preparación por requerimientos.',
    status: 409,
  },
  SCHOOL_PREPARATION_NOT_OPEN: {
    message:
      'La preparación solo se puede modificar mientras la lista está "En preparación".',
    status: 409,
  },
  SCHOOL_PREPARATION_NOT_FINISHED: {
    message: 'Finalice la preparación de la lista antes de entregarla.',
    status: 409,
  },
  SCHOOL_PREPARATION_INCOMPLETE: {
    message:
      'Hay requerimientos sin cubrir; asigne los productos de inventario antes de finalizar.',
    status: 409,
  },
  SCHOOL_INVALID_ASSIGNMENTS: {
    message: 'Las asignaciones de productos no son válidas.',
  },
  SCHOOL_DUPLICATE_ASSIGNMENT: {
    message: 'Un producto está asignado dos veces al mismo requerimiento.',
  },
  SCHOOL_ASSIGNMENT_EXCEEDS: {
    message:
      'Se asignaron más unidades de las solicitadas en un requerimiento.',
  },
  SCHOOL_PURGE_CONFIRMATION: {
    message: 'Escriba exactamente "BORRAR TODO" para confirmar el borrado.',
  },
  SCHOOL_REFUND_METHOD_REQUIRED: {
    message: 'Indique cómo se devuelve al cliente el dinero recibido.',
  },
};

const STATUS_LABEL: Record<string, string> = {
  ENTREGADA: 'entregada',
  CANCELADA: 'cancelada',
  TERMINADA: 'terminada (ya descontó inventario)',
};

const money = (value: string | undefined) =>
  `Q${Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** A product name may itself contain ":"; the whole tail is the name. */
function withName(
  parts: string[],
  format: (name: string) => string,
): string | null {
  const name = parts.join(':').trim();
  return name ? format(name) : null;
}

/** Messages that carry the detail the SQL function appended after the code. */
const DETAILED: Record<string, (parts: string[]) => string | null> = {
  SCHOOL_PAYMENT_EXCEEDS_BALANCE: ([balance]) =>
    `El pago supera el saldo pendiente (${money(balance)}).`,
  SCHOOL_QUOTE_TOTAL_BELOW_PAID: ([paid]) =>
    `El nuevo total no puede ser menor a lo que el cliente ya pagó (${money(paid)}).`,
  SCHOOL_QUOTE_NOT_PAID: ([balance]) =>
    `La cotización tiene un saldo pendiente de ${money(balance)}; no se puede entregar.`,
  SCHOOL_QUOTE_CLOSED: ([status]) =>
    STATUS_LABEL[status]
      ? `La cotización está ${STATUS_LABEL[status]} y no admite esta operación.`
      : null,
  SCHOOL_QUOTE_NOT_EDITABLE: ([status]) =>
    STATUS_LABEL[status]
      ? `La cotización está ${STATUS_LABEL[status]}; ya no se puede modificar.`
      : null,
  SCHOOL_PRICE_OVERRIDE_FORBIDDEN: (parts) =>
    withName(
      parts,
      (name) =>
        `Su rol no puede cambiar el precio ni aplicar descuento a "${name}"; solicítelo a un supervisor o administrador.`,
    ),
  SCHOOL_INVALID_QUANTITY: (parts) =>
    withName(
      parts,
      (name) =>
        `La cantidad de "${name}" debe ser un número entero entre 1 y 9,999.`,
    ),
  SCHOOL_INVALID_PRICE: (parts) =>
    withName(parts, (name) => `El precio de "${name}" no es válido.`),
  SCHOOL_INVALID_DISCOUNT: (parts) =>
    withName(parts, (name) => `El descuento de "${name}" no es válido.`),
  // SCHOOL_SUPPLY_INCOMPLETE:<pending>:<product name>
  SCHOOL_SUPPLY_INCOMPLETE: ([pending, ...name]) =>
    name.length
      ? `No se puede despachar: faltan ${pending} unidad(es) de "${name.join(':')}" por abastecer.`
      : null,
  SCHOOL_SUPPLY_OVER_PENDING: ([pending]) =>
    `No se puede asignar más de lo pendiente en la lista (${pending} unidad(es)).`,
  SCHOOL_SUPPLY_NO_FREE_UNITS: ([free]) =>
    `No hay suficientes unidades libres en Bodega (libres: ${free}).`,
  SCHOOL_SUPPLY_PURCHASE_EXHAUSTED: ([left]) =>
    `A esa compra solo le quedan ${left} unidad(es) sin asignar.`,
  // SCHOOL_INSUFFICIENT_STOCK:<available>:<requested>:<product name>
  SCHOOL_INSUFFICIENT_STOCK: ([available, requested, ...name]) =>
    name.length
      ? `No hay existencias suficientes de "${name.join(':')}" en Bodega: disponibles ${available}, se necesitan ${requested}.`
      : null,
  // SCHOOL_PREPARATION_INCOMPLETE:<assigned>:<requested>:<requirement>
  SCHOOL_PREPARATION_INCOMPLETE: ([assigned, requested, ...name]) =>
    name.length
      ? `El requerimiento "${name.join(':')}" tiene ${assigned} de ${requested} unidad(es) asignadas; cúbralo antes de finalizar la preparación.`
      : null,
  // SCHOOL_ASSIGNMENT_EXCEEDS:<assigned>:<requested>:<requirement>
  SCHOOL_ASSIGNMENT_EXCEEDS: ([assigned, requested, ...name]) =>
    name.length
      ? `Al requerimiento "${name.join(':')}" se asignaron ${assigned} unidad(es) y solo pide ${requested}.`
      : null,
  SCHOOL_DUPLICATE_ASSIGNMENT: (parts) =>
    withName(
      parts,
      (name) =>
        `El mismo producto aparece dos veces en el requerimiento "${name}"; sume las cantidades en una sola asignación.`,
    ),
  SCHOOL_PREPARATION_NOT_OPEN: ([status]) =>
    status
      ? `La lista no está "En preparación" (estado actual: ${status.toLowerCase().replace(/_/g, ' ')}).`
      : null,
  SCHOOL_PRODUCT_INACTIVE: (parts) =>
    withName(
      parts,
      (name) => `El producto "${name}" está desactivado en el inventario.`,
    ),
};

export function schoolListError(code: string): SchoolListRuleError {
  const entry = MESSAGES[code] ?? {
    message: 'La operación no es válida.',
  };
  return new SchoolListRuleError(code, entry.message, entry.status ?? 400);
}

/** Maps the message of a SQL `RAISE EXCEPTION 'CODE[:detail…]'`; null when it isn't ours. */
export function schoolListErrorFromMessage(
  message: string,
): SchoolListRuleError | null {
  const [code, ...parts] = message.split(':');
  if (!MESSAGES[code]) {
    return null;
  }
  const detailed = DETAILED[code]?.(parts);
  return detailed
    ? new SchoolListRuleError(code, detailed, MESSAGES[code].status ?? 400)
    : schoolListError(code);
}

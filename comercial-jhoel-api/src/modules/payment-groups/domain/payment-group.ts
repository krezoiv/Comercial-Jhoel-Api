import { DomainError } from '../../../shared/domain/domain-error';

/**
 * Pagos grupales (migration `1760009400000-PaymentGroups`). A group of
 * payments of one Transaccionar operation type: the money of an OUT group is
 * reserved when the group is created, every payment is confirmed on its own
 * (each confirmed delivery is a real Transaccionar operation, so Caja, Kardex,
 * Estado de Cuenta and bank balances move exactly as an individual one), and
 * the group is closed releasing what was not used.
 *
 * Every amount and status here is computed by the database
 * (`payment_group_item_balances`, `payment_group_balances`,
 * `cash_reserved_total()`); this module only carries them.
 */
export type PaymentGroupCashDirection = 'IN' | 'OUT' | 'NONE';
export type PaymentGroupLifecycle = 'ABIERTO' | 'CERRADO' | 'ANULADO';
export type PaymentGroupStatus =
  'PENDIENTE' | 'EN_PROCESO' | 'PARCIAL' | 'COMPLETADO' | 'ANULADO';
export const PAYMENT_GROUP_STATUSES: readonly PaymentGroupStatus[] = [
  'PENDIENTE',
  'EN_PROCESO',
  'PARCIAL',
  'COMPLETADO',
  'ANULADO',
];
export type PaymentGroupItemStatus =
  'PENDIENTE' | 'PAGADO' | 'PARCIAL' | 'SIN_PAGO' | 'ANULADO';
export type PaymentGroupEventType =
  | 'CREADO'
  | 'ENTREGA'
  | 'SIN_PAGO'
  | 'OBSERVACION'
  | 'MONTO_CAMBIADO'
  | 'RESOLUCION'
  | 'ANULACION'
  | 'CIERRE'
  | 'ANULACION_GRUPO';

export const MAX_PAYMENT_GROUP_ITEMS = 200;

export interface PaymentGroupSummaryRow {
  id: string;
  code: string;
  number: number;
  transactionTypeId: string;
  transactionTypeName: string;
  cashDirection: PaymentGroupCashDirection;
  description: string;
  operationDate: string;
  transactionBankId: string | null;
  transactionBankName: string | null;
  bankAccountId: string | null;
  bankAccountName: string | null;
  authorizedAmount: number;
  observations: string | null;
  lifecycle: PaymentGroupLifecycle;
  status: PaymentGroupStatus;
  itemCount: number;
  paidCount: number;
  partialCount: number;
  noPaymentCount: number;
  pendingCount: number;
  voidedCount: number;
  unresolvedCount: number;
  /** Sum of the expected amounts of the non-voided items. */
  assignedAmount: number;
  /** Delivered (OUT) or collected (IN) through active operations. */
  paidAmount: number;
  /** Still to execute: expected − paid − released of every item. */
  outstandingAmount: number;
  /** Released back to the available cash (item resolutions, voids, close). */
  releasedAmount: number;
  /** Still reserved (open OUT group): authorized − paid − released. */
  reservedAmount: number;
  closedAt: Date | null;
  closedByUsername: string | null;
  closeNote: string | null;
  closingPaid: number | null;
  closingReleased: number | null;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
}

export interface PaymentGroupItemRow {
  id: string;
  itemNumber: number;
  expectedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  releasedAmount: number;
  reference: string | null;
  status: PaymentGroupItemStatus;
  deliveryCount: number;
  lastPaidAt: Date | null;
  noPaymentAt: Date | null;
  resolution: string | null;
  resolvedAt: Date | null;
  resolvedByUsername: string | null;
  voidedAt: Date | null;
  voidReason: string | null;
  /** Kardex movement numbers of its operations ("MOV-000123"). */
  operations: {
    operationId: string;
    amount: number;
    movementNumber: string | null;
    isVoided: boolean;
    createdAt: Date;
    username: string;
  }[];
}

export interface PaymentGroupEventRow {
  id: string;
  itemId: string | null;
  itemNumber: number | null;
  eventType: PaymentGroupEventType;
  itemStatus: PaymentGroupItemStatus | null;
  groupStatus: PaymentGroupStatus | null;
  amount: number | null;
  note: string | null;
  operationId: string | null;
  username: string;
  createdAt: Date;
}

/** Caja figures, from the official Kardex and the open reservations. */
export interface CashReservationSnapshot {
  /** Physical cash in Caja (Kardex). */
  balance: number;
  /** Money of open groups still reserved. */
  reserved: number;
  /** balance − reserved: what other operations can use. */
  available: number;
}

export interface PaymentGroupCloseCheck {
  canClose: boolean;
  pendingCount: number;
  unresolvedCount: number;
  /** What closing would release (authorized − paid − already released). */
  releaseOnClose: number;
}

export interface PaymentGroupDetail {
  group: PaymentGroupSummaryRow;
  items: PaymentGroupItemRow[];
  cash: CashReservationSnapshot;
  closeCheck: PaymentGroupCloseCheck;
}

export interface PaymentGroupTotals {
  groups: number;
  pending: number;
  inProcess: number;
  completed: number;
  reserved: number;
  paid: number;
  outstanding: number;
  released: number;
}

/** What closing a group would do, from the database figures (never recomputed by the UI). */
export function closeCheckOf(
  group: PaymentGroupSummaryRow,
): PaymentGroupCloseCheck {
  const releaseOnClose =
    group.lifecycle === 'ABIERTO'
      ? Math.max(
          Math.round(
            (group.authorizedAmount - group.paidAmount - group.releasedAmount) *
              100,
          ) / 100,
          0,
        )
      : 0;
  return {
    canClose:
      group.lifecycle === 'ABIERTO' &&
      group.pendingCount === 0 &&
      group.unresolvedCount === 0,
    pendingCount: group.pendingCount,
    unresolvedCount: group.unresolvedCount,
    releaseOnClose,
  };
}

export class PaymentGroupError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const money = (value: string): string =>
  `Q${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const MESSAGES: Record<
  string,
  { message: string | ((detail: string) => string); status?: number }
> = {
  PAYMENT_GROUP_IDEMPOTENCY_KEY_REQUIRED: {
    message: 'Falta el identificador de la solicitud.',
  },
  PAYMENT_GROUP_DESCRIPTION_REQUIRED: {
    message:
      'Escriba el nombre o la descripción del grupo (3 a 200 caracteres).',
  },
  PAYMENT_GROUP_TYPE_NOT_ALLOWED: {
    message:
      'Ese tipo de operación no permite pago grupal (actívelo en Sistema → Tipos de transacción).',
  },
  PAYMENT_GROUP_AGENT_REQUIRED: {
    message: 'Seleccione el banco agente de las operaciones del grupo.',
  },
  PAYMENT_GROUP_AGENT_NOT_ALLOWED: {
    message:
      'Cooperativa Guayacán tiene su propia caja: sus pagos no se agrupan con la Caja principal.',
  },
  PAYMENT_GROUP_ACCOUNT_REQUIRED: {
    message: 'Seleccione la cuenta bancaria de las operaciones del grupo.',
  },
  PAYMENT_GROUP_INVALID_AMOUNT: {
    message:
      'Los montos deben ser mayores a cero y con dos decimales como máximo.',
  },
  PAYMENT_GROUP_ITEMS_REQUIRED: {
    message: 'Agregue al menos una transacción.',
  },
  PAYMENT_GROUP_TOO_MANY_ITEMS: {
    message: `Un grupo admite como máximo ${MAX_PAYMENT_GROUP_ITEMS} transacciones.`,
  },
  PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED: {
    message: (detail) =>
      `La suma de las transacciones (${money(detail)}) supera el monto autorizado del grupo.`,
  },
  PAYMENT_GROUP_INSUFFICIENT_AVAILABLE: {
    message: (detail) =>
      `No hay efectivo disponible para reservar ese monto: disponible para operar ${money(detail)} (el saldo de Caja menos lo reservado por otros grupos).`,
    status: 409,
  },
  PAYMENT_GROUP_NOT_FOUND: {
    message: 'No se encontró el pago grupal.',
    status: 404,
  },
  PAYMENT_GROUP_ITEM_NOT_FOUND: {
    message: 'No se encontró la transacción del grupo.',
    status: 404,
  },
  PAYMENT_GROUP_NOT_OPEN: {
    message: 'El grupo ya está cerrado o anulado: no admite cambios.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_VOIDED: {
    message: 'La transacción está anulada.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_ALREADY_PAID: {
    message: 'La transacción ya fue pagada por completo.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_RELEASED: {
    message:
      'El saldo de esta transacción ya se liberó: no admite más entregas.',
    status: 409,
  },
  PAYMENT_GROUP_AMOUNT_EXCEEDS: {
    message: (detail) =>
      `El monto supera lo que falta de la transacción (${money(detail)}).`,
  },
  PAYMENT_GROUP_TYPE_CHANGED: {
    message:
      'El tipo de operación cambió su efecto en Caja después de crear el grupo: ciérrelo o anúlelo.',
    status: 409,
  },
  PAYMENT_GROUP_NOTE_REQUIRED: {
    message: (detail) =>
      `Escriba la observación (mínimo ${detail || '5'} caracteres).`,
  },
  PAYMENT_GROUP_ITEM_ALREADY_PROCESSED: {
    message:
      'La transacción ya fue procesada: solo una transacción pendiente se marca sin pago o cambia su monto.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_NOT_RESOLVABLE: {
    message:
      'Solo se documenta la resolución de una transacción parcial o sin pago.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_ALREADY_RESOLVED: {
    message: 'La transacción ya tiene su resolución.',
    status: 409,
  },
  PAYMENT_GROUP_ITEM_HAS_PAYMENTS: {
    message: (detail) =>
      `La transacción ya movió ${money(detail)}: solo se anula si el dinero realmente regresó (se registra la reversa). Si no regresó, deje una observación.`,
    status: 409,
  },
  PAYMENT_GROUP_HAS_PENDING: {
    message: (detail) =>
      `Hay ${detail} transacción(es) pendiente(s): confírmelas, márquelas sin pago o anúlelas antes de cerrar.`,
    status: 409,
  },
  PAYMENT_GROUP_UNRESOLVED: {
    message: (detail) =>
      `Hay ${detail} transacción(es) parcial(es) o sin pago sin resolución documentada.`,
    status: 409,
  },
  PAYMENT_GROUP_HAS_PAYMENTS: {
    message:
      'El grupo ya tiene pagos confirmados: ciérrelo (libera lo no usado) o anule primero esas transacciones.',
    status: 409,
  },
  PAYMENT_GROUP_OPERATION_LOCKED: {
    message: (detail) =>
      `Esta operación es la entrega ${detail} de un pago grupal: anúlela desde el grupo (Agentes Bancarios → Pagos grupales).`,
    status: 409,
  },
  PAYMENT_GROUP_HISTORY_IMMUTABLE: {
    message: 'El historial del grupo no se puede modificar.',
    status: 409,
  },
  PAYMENT_GROUP_DIRECT_WRITE: {
    message: 'El grupo solo se modifica con sus acciones.',
    status: 409,
  },
  PAYMENT_GROUP_FORBIDDEN: {
    message:
      'Solo un administrador puede liberar, anular o cerrar un pago grupal.',
    status: 403,
  },
  CASH_CUSTODY_FORBIDDEN: {
    message:
      'Solo un administrador puede liberar, anular o cerrar un pago grupal.',
    status: 403,
  },
  CASH_INSUFFICIENT_BALANCE: {
    message: 'No hay efectivo suficiente en Caja para esa entrega.',
    status: 409,
  },
  PAYMENT_GROUP_DAY_NOT_OPEN: {
    message: (detail) =>
      `Debe aperturar el día ${detail} antes de registrar pagos.`,
  },
  PAYMENT_GROUP_DAY_CLOSED: {
    message: (detail) => `El día ${detail} ya se cerró: no admite más pagos.`,
    status: 409,
  },
};

export function paymentGroupError(
  code: string,
  detail = '',
): PaymentGroupError {
  const entry = MESSAGES[code];
  const message =
    typeof entry.message === 'function' ? entry.message(detail) : entry.message;
  return new PaymentGroupError(code, message, entry.status);
}

/** Maps a `RAISE '<CODE>:<detail>'` of the payment-group functions, or null when it is not one of them. */
export function paymentGroupErrorFromMessage(
  message: string,
): PaymentGroupError | null {
  const [code, ...rest] = message.split(':');
  const key = code.trim();
  return MESSAGES[key] ? paymentGroupError(key, rest.join(':').trim()) : null;
}

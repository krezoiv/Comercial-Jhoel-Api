import { DomainError } from '../../../shared/domain/domain-error';

/**
 * Pagos grupales (migration `1760009400000-PaymentGroups`). A group of
 * payments of one Transaccionar operation type: the money of an OUT group is
 * reserved when the group is created, every payment is confirmed on its own
 * (each confirmed delivery is a real Transaccionar operation, so Caja, Kardex,
 * Estado de Cuenta and bank balances move exactly as an individual one), and
 * the group is closed releasing what was not used.
 *
 * Génesis groups (migration `1760009500000-PaymentGroupApproval`) are saved
 * PENDIENTE DE APROBACIÓN without moving anything and an admin approves them as
 * a whole: approval books every cuota (one real operation each) atomically and
 * closes the group. Their cuotas carry credit number, client and observation.
 *
 * Every amount and status here is computed by the database
 * (`payment_group_item_balances`, `payment_group_balances`,
 * `cash_reserved_total()`); this module only carries them.
 */
export type PaymentGroupCashDirection = 'IN' | 'OUT' | 'NONE';
export type PaymentGroupLifecycle = 'ABIERTO' | 'CERRADO' | 'ANULADO';
export type PaymentGroupStatus =
  | 'PENDIENTE_APROBACION'
  | 'APROBADO'
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'PARCIAL'
  | 'COMPLETADO'
  | 'ANULADO';
export const PAYMENT_GROUP_STATUSES: readonly PaymentGroupStatus[] = [
  'PENDIENTE_APROBACION',
  'APROBADO',
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
  | 'ANULACION_GRUPO'
  | 'EDITADO'
  | 'APROBACION';

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
  /** Génesis group: saved pending approval and booked as a whole when an admin approves it. */
  requiresApproval: boolean;
  /** Approval date / admin (the group's close, for an approval group). */
  approvedAt: Date | null;
  approvedByUsername: string | null;
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
  /** Beneficiary — for a Génesis cuota, the client's name. */
  reference: string | null;
  /** Génesis cuota: loan (crédito) number. */
  creditNumber: string | null;
  /** Observation written on the row. */
  observation: string | null;
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
  /** EDITADO: the group before and after the correction (`{ before, after }`). */
  details: Record<string, unknown> | null;
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

/** Consistency of a Génesis group before approval (the database re-checks it under its lock). */
export interface PaymentGroupApprovalCheck {
  required: boolean;
  /** Saved and waiting for an admin. */
  pending: boolean;
  /** Pending and consistent: cuotas add up to the declared total and every row is complete. */
  canApprove: boolean;
  cuotaCount: number;
  cuotasTotal: number;
  declaredTotal: number;
  /** declaredTotal − cuotasTotal (0 = information correct). */
  difference: number;
  /** Numbers of the cuotas without credit number or client name. */
  incompleteCuotas: number[];
}

export interface PaymentGroupDetail {
  group: PaymentGroupSummaryRow;
  items: PaymentGroupItemRow[];
  cash: CashReservationSnapshot;
  closeCheck: PaymentGroupCloseCheck;
  approvalCheck: PaymentGroupApprovalCheck;
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
    // An approval group is closed by its approval, never by hand.
    canClose:
      !group.requiresApproval &&
      group.lifecycle === 'ABIERTO' &&
      group.pendingCount === 0 &&
      group.unresolvedCount === 0,
    pendingCount: group.pendingCount,
    unresolvedCount: group.unresolvedCount,
    releaseOnClose,
  };
}

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

/** Approval readiness of a group, from its database figures and rows. */
export function approvalCheckOf(
  group: PaymentGroupSummaryRow,
  items: PaymentGroupItemRow[],
): PaymentGroupApprovalCheck {
  const active = items.filter((item) => item.status !== 'ANULADO');
  const incompleteCuotas = active
    .filter(
      (item) =>
        !item.creditNumber?.trim() || (item.reference?.trim().length ?? 0) < 2,
    )
    .map((item) => item.itemNumber);
  const difference = roundMoney(group.authorizedAmount - group.assignedAmount);
  const pending = group.requiresApproval && group.lifecycle === 'ABIERTO';
  return {
    required: group.requiresApproval,
    pending,
    canApprove:
      pending &&
      active.length > 0 &&
      difference === 0 &&
      incompleteCuotas.length === 0,
    cuotaCount: active.length,
    cuotasTotal: group.assignedAmount,
    declaredTotal: group.authorizedAmount,
    difference,
    incompleteCuotas,
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
      'Solo un administrador puede liberar, anular, cerrar o aprobar un pago grupal.',
    status: 403,
  },
  CASH_INSUFFICIENT_BALANCE: {
    message: 'No hay efectivo suficiente en Caja para esa entrega.',
    status: 409,
  },
  PAYMENT_GROUP_PENDING_APPROVAL: {
    message:
      'El grupo está pendiente de aprobación: solo se puede corregir, aprobar o anular completo.',
    status: 409,
  },
  PAYMENT_GROUP_NOT_EDITABLE: {
    message:
      'Solo un grupo de Préstamos Génesis pendiente de aprobación se corrige completo.',
    status: 409,
  },
  PAYMENT_GROUP_NOT_APPROVABLE: {
    message:
      'Este grupo no requiere aprobación: sus pagos se confirman uno por uno.',
    status: 409,
  },
  PAYMENT_GROUP_CHANGED: {
    message:
      'El grupo cambió mientras lo revisaba: vuelva a cargarlo y revíselo antes de aprobar.',
    status: 409,
  },
  PAYMENT_GROUP_TOTAL_MISMATCH: {
    message: (detail) =>
      `La suma de las cuotas (${money(detail)}) no coincide con el monto total del grupo. Corrija las cuotas o el monto total.`,
  },
  PAYMENT_GROUP_COUNT_MISMATCH: {
    message: (detail) => {
      const [registered, declared] = detail.split('/');
      return `Hay ${registered} cuota(s) registrada(s) y se declararon ${declared}. Corrija la cantidad o las cuotas.`;
    },
  },
  PAYMENT_GROUP_CUOTA_INCOMPLETE: {
    message: (detail) =>
      `La cuota #${detail} necesita número de crédito y nombre del cliente.`,
  },
  PAYMENT_GROUP_TEXT_TOO_LONG: {
    message:
      'Un dato de la cuota es demasiado largo (crédito 40, cliente 150, observación 255 caracteres).',
  },
  PAYMENT_GROUP_DRAFT_ITEM_NOTE: {
    message:
      'Mientras el grupo espera aprobación, la observación de una cuota se escribe al corregir el grupo.',
    status: 409,
  },
  PAYMENT_GROUP_EDIT_FORBIDDEN: {
    message:
      'Solo quien registró el grupo o un administrador puede corregirlo.',
    status: 403,
  },
  PAYMENT_GROUP_APPROVE_FORBIDDEN: {
    message: 'Solo un administrador puede aprobar un pago grupal.',
    status: 403,
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

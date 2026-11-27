/**
 * Pagos grupales (backend migration 1760009400000). Every amount and status
 * comes from the backend (derived from the real records); Angular never
 * computes a balance, a reservation or a status.
 *
 * Génesis groups (backend 1760009500000) are saved PENDIENTE DE APROBACIÓN
 * without moving anything; an admin approves them as a whole, which books
 * every cuota. A cuota is its amount plus an optional observation (1760009600000).
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
export type PaymentGroupItemStatus = 'PENDIENTE' | 'PAGADO' | 'PARCIAL' | 'SIN_PAGO' | 'ANULADO';
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

export interface PaymentGroup {
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
  /** Génesis group: saved pending approval and booked as a whole by an admin. */
  requiresApproval: boolean;
  approvedAt: string | null;
  approvedByUsername: string | null;
  itemCount: number;
  paidCount: number;
  partialCount: number;
  noPaymentCount: number;
  pendingCount: number;
  voidedCount: number;
  unresolvedCount: number;
  assignedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  releasedAmount: number;
  reservedAmount: number;
  closedAt: string | null;
  closedByUsername: string | null;
  closeNote: string | null;
  closingPaid: number | null;
  closingReleased: number | null;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export interface PaymentGroupItemOperation {
  operationId: string;
  amount: number;
  movementNumber: string | null;
  isVoided: boolean;
  createdAt: string;
  username: string;
}

export interface PaymentGroupItem {
  id: string;
  itemNumber: number;
  expectedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  releasedAmount: number;
  /** Beneficiary (Pago Varios); on older Génesis cuotas, the client's name. */
  reference: string | null;
  /** Loan (crédito) number of older Génesis cuotas; no longer captured. */
  creditNumber: string | null;
  observation: string | null;
  status: PaymentGroupItemStatus;
  deliveryCount: number;
  lastPaidAt: string | null;
  noPaymentAt: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  resolvedByUsername: string | null;
  voidedAt: string | null;
  voidReason: string | null;
  operations: PaymentGroupItemOperation[];
}

export interface PaymentGroupEvent {
  id: string;
  itemId: string | null;
  itemNumber: number | null;
  eventType: PaymentGroupEventType;
  itemStatus: PaymentGroupItemStatus | null;
  groupStatus: PaymentGroupStatus | null;
  amount: number | null;
  note: string | null;
  operationId: string | null;
  /** EDITADO: the group before and after the correction. */
  details: { before?: PaymentGroupSnapshot; after?: PaymentGroupSnapshot } | null;
  username: string;
  createdAt: string;
}

/** A Génesis group as it was before / after a correction (history). */
export interface PaymentGroupSnapshot {
  description: string;
  total: number;
  items: { number: number; creditNumber: string | null; reference: string | null; expectedAmount: number; observation: string | null }[];
}

export interface CashReservationSnapshot {
  balance: number;
  reserved: number;
  available: number;
}

export interface PaymentGroupCloseCheck {
  canClose: boolean;
  pendingCount: number;
  unresolvedCount: number;
  releaseOnClose: number;
}

/** Consistency of a Génesis group before approval (computed by the backend). */
export interface PaymentGroupApprovalCheck {
  required: boolean;
  pending: boolean;
  canApprove: boolean;
  cuotaCount: number;
  cuotasTotal: number;
  declaredTotal: number;
  /** declaredTotal − cuotasTotal (0 = information correct). */
  difference: number;
}

export interface PaymentGroupDetail {
  group: PaymentGroup;
  items: PaymentGroupItem[];
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

export interface PaymentGroupList {
  items: PaymentGroup[];
  total: number;
  page: number;
  limit: number;
  summary: PaymentGroupTotals;
  cash: CashReservationSnapshot;
}

export interface PaymentGroupFilters {
  dateFrom?: string;
  dateTo?: string;
  transactionTypeId?: string;
  status?: PaymentGroupStatus;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/** One row sent to the backend: a transaction, or a Génesis cuota. */
export interface PaymentGroupItemInput {
  expectedAmount: number;
  reference?: string;
  creditNumber?: string;
  observation?: string;
}

export interface CreatePaymentGroupInput {
  transactionTypeId: string;
  description: string;
  transactionBankId?: string;
  bankAccountId?: string;
  authorizedAmount: number;
  /** Declared number of cuotas: the backend rejects it when it differs from the rows. */
  declaredCount?: number;
  items: PaymentGroupItemInput[];
  observations?: string;
  clientRequestId: string;
}

/** Correction of a Génesis group pending approval (the whole group as it should be). */
export interface UpdatePendingPaymentGroupInput {
  description: string;
  authorizedAmount: number;
  declaredCount: number;
  items: PaymentGroupItemInput[];
  note?: string;
}

/** What the admin reviewed: approval fails if the group changed meanwhile. */
export interface ApprovePaymentGroupInput {
  expectedAmount: number;
  expectedCount: number;
  clientRequestId: string;
}

export const PAYMENT_GROUP_STATUS_LABEL: Record<PaymentGroupStatus, string> = {
  PENDIENTE_APROBACION: 'Pendiente de aprobación',
  APROBADO: 'Aprobado',
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  PARCIAL: 'Parcial',
  COMPLETADO: 'Completado',
  ANULADO: 'Anulado',
};

export const PAYMENT_GROUP_ITEM_STATUS_LABEL: Record<PaymentGroupItemStatus, string> = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  PARCIAL: 'Parcial',
  SIN_PAGO: 'Sin pago',
  ANULADO: 'Anulado',
};

export const PAYMENT_GROUP_EVENT_LABEL: Record<PaymentGroupEventType, string> = {
  CREADO: 'Grupo creado',
  ENTREGA: 'Pago confirmado',
  SIN_PAGO: 'Sin pago',
  OBSERVACION: 'Observación',
  MONTO_CAMBIADO: 'Datos cambiados',
  RESOLUCION: 'Resolución',
  ANULACION: 'Anulada',
  CIERRE: 'Grupo cerrado',
  ANULACION_GRUPO: 'Grupo anulado',
  EDITADO: 'Grupo corregido',
  APROBACION: 'Grupo aprobado',
};

/** Status colors: pendiente amber, en proceso blue, pagado/completado green, parcial orange, sin pago red, anulado dark gray. */
export type PaymentGroupTone = 'pending' | 'process' | 'paid' | 'partial' | 'unpaid' | 'voided';

export function groupStatusTone(status: PaymentGroupStatus): PaymentGroupTone {
  switch (status) {
    case 'EN_PROCESO':
      return 'process';
    case 'PARCIAL':
      return 'partial';
    case 'COMPLETADO':
    case 'APROBADO':
      return 'paid';
    case 'ANULADO':
      return 'voided';
    default:
      return 'pending';
  }
}

export function itemStatusTone(status: PaymentGroupItemStatus): PaymentGroupTone {
  switch (status) {
    case 'PAGADO':
      return 'paid';
    case 'PARCIAL':
      return 'partial';
    case 'SIN_PAGO':
      return 'unpaid';
    case 'ANULADO':
      return 'voided';
    default:
      return 'pending';
  }
}

/** Words for the money flow of a group: an OUT group delivers (reserved cash), an IN group collects. */
export function groupFlowWords(direction: PaymentGroupCashDirection): {
  paid: string;
  confirm: string;
  cashVerb: string;
} {
  return direction === 'IN'
    ? { paid: 'Cobrado', confirm: 'Registrar cobro', cashVerb: 'Entrada a Caja' }
    : direction === 'OUT'
      ? { paid: 'Entregado', confirm: 'Confirmar pago', cashVerb: 'Salida real de Caja' }
      : { paid: 'Pagado', confirm: 'Confirmar pago', cashVerb: 'Sin efecto en Caja' };
}

/** Pago individual vs Pago grupal: two modalities of the same operation type (Pago Varios, Préstamos Génesis). */
export type OperationModality = 'INDIVIDUAL' | 'GRUPAL';

export const OPERATION_MODALITY_LABEL: Record<OperationModality, string> = {
  INDIVIDUAL: 'Individual',
  GRUPAL: 'Grupal',
};

/** The group a GRUPAL operation belongs to. */
export interface OperationPaymentGroupLink {
  groupId: string;
  code: string;
  description: string;
  groupStatus: PaymentGroupStatus;
  itemId: string;
  itemNumber: number;
  itemCount: number;
  itemStatus: PaymentGroupItemStatus;
  expectedAmount: number;
  paidAmount: number;
}

/** Status filter of "Operaciones de <tipo>" (individual operations and groups share one list). */
export type TypeEntryStatus =
  | 'VIGENTE'
  | 'ANULADA'
  | 'PENDIENTE_APROBACION'
  | 'APROBADO'
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'PARCIAL'
  | 'COMPLETADO';

export const TYPE_ENTRY_STATUS_LABEL: Record<TypeEntryStatus, string> = {
  VIGENTE: 'Vigente (individual)',
  ANULADA: 'Anulada / anulado',
  PENDIENTE_APROBACION: 'Pendiente de aprobación (grupo)',
  APROBADO: 'Aprobado (grupo)',
  PENDIENTE: 'Pendiente (grupo)',
  EN_PROCESO: 'En proceso (grupo)',
  PARCIAL: 'Parcial (grupo)',
  COMPLETADO: 'Completado (grupo)',
};

/** One row of "Operaciones de <tipo>": an individual operation, or a whole payment group. */
export interface TypeOperationEntry {
  modality: OperationModality;
  /** Operation id (INDIVIDUAL) or group id (GRUPAL). */
  id: string;
  createdAt: string;
  operationDate: string;
  description: string | null;
  amount: number;
  transactionCount: number;
  bankName: string | null;
  userId: string;
  username: string;
  /** VIGENTE / ANULADA, or the group status. */
  status: string;
  group: {
    code: string;
    cashDirection: PaymentGroupCashDirection;
    itemCount: number;
    authorizedAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    reservedAmount: number;
  } | null;
}

export interface TypeOperationFilters {
  modality?: OperationModality;
  startDate?: string;
  endDate?: string;
  status?: TypeEntryStatus;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TypeOperationList {
  items: TypeOperationEntry[];
  total: number;
  page: number;
  limit: number;
  summary: {
    individualCount: number;
    groupCount: number;
    groupReserved: number;
    groupPaid: number;
    groupOutstanding: number;
  };
}

/** Route of a group's detail, inside Transaccionar (groups are a modality of the operation, not a module). */
export function paymentGroupRoute(groupId: string): string[] {
  return ['/dashboard/transaccionar/pago-grupal', groupId];
}

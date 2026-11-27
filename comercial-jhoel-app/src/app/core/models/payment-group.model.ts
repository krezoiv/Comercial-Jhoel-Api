/**
 * Pagos grupales (backend migration 1760009400000). Every amount and status
 * comes from the backend (derived from the real records); Angular never
 * computes a balance, a reservation or a status.
 */
export type PaymentGroupCashDirection = 'IN' | 'OUT' | 'NONE';
export type PaymentGroupLifecycle = 'ABIERTO' | 'CERRADO' | 'ANULADO';
export type PaymentGroupStatus = 'PENDIENTE' | 'EN_PROCESO' | 'PARCIAL' | 'COMPLETADO' | 'ANULADO';
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
  | 'ANULACION_GRUPO';

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
  reference: string | null;
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
  username: string;
  createdAt: string;
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

export interface PaymentGroupDetail {
  group: PaymentGroup;
  items: PaymentGroupItem[];
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

export interface CreatePaymentGroupInput {
  transactionTypeId: string;
  description: string;
  transactionBankId?: string;
  bankAccountId?: string;
  authorizedAmount: number;
  items: { expectedAmount: number; reference?: string }[];
  observations?: string;
  clientRequestId: string;
}

export const PAYMENT_GROUP_STATUS_LABEL: Record<PaymentGroupStatus, string> = {
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

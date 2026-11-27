/**
 * Pago individual vs Pago grupal (owner request, 2026-11-26): both are
 * modalities of the SAME operation types (Pago Varios, Préstamos Génesis).
 *
 * A Transaccionar operation is GRUPAL when it is the delivery / collection of
 * a transaction of a payment group (`payment_group_deliveries.operation_id`,
 * migration 1760009400000), INDIVIDUAL otherwise. The relation already exists,
 * so the modality is derived — never stored twice, never written on historical
 * rows: every operation registered before groups existed is INDIVIDUAL.
 */
export type OperationModality = 'INDIVIDUAL' | 'GRUPAL';
export const OPERATION_MODALITIES: readonly OperationModality[] = [
  'INDIVIDUAL',
  'GRUPAL',
];

/** The group a GRUPAL operation belongs to ("Transacción 6 de 10"). */
export interface OperationPaymentGroupLink {
  groupId: string;
  code: string;
  description: string;
  /** Group display status (PENDIENTE, EN_PROCESO, PARCIAL, COMPLETADO, ANULADO). */
  groupStatus: string;
  itemId: string;
  itemNumber: number;
  itemCount: number;
  /** Transaction status inside the group (PAGADO, PARCIAL...). */
  itemStatus: string;
  expectedAmount: number;
  paidAmount: number;
}

/** Status filter of the per-type list: individual operations and groups share one list. */
export type TypeEntryStatus =
  | 'VIGENTE'
  | 'ANULADA'
  | 'PENDIENTE_APROBACION'
  | 'APROBADO'
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'PARCIAL'
  | 'COMPLETADO';
export const TYPE_ENTRY_STATUSES: readonly TypeEntryStatus[] = [
  'VIGENTE',
  'ANULADA',
  'PENDIENTE_APROBACION',
  'APROBADO',
  'PENDIENTE',
  'EN_PROCESO',
  'PARCIAL',
  'COMPLETADO',
];

/**
 * One row of "Operaciones de <tipo>" in Transaccionar: an individual operation,
 * or a whole payment group (its deliveries are NOT listed as individual rows,
 * so a group payment is never mistaken for an independent one).
 */
export interface TypeOperationEntry {
  modality: OperationModality;
  /** Operation id (INDIVIDUAL) or group id (GRUPAL). */
  id: string;
  createdAt: Date;
  operationDate: string;
  description: string | null;
  /** Operation total (INDIVIDUAL) or authorized amount (GRUPAL). */
  amount: number;
  transactionCount: number;
  bankName: string | null;
  userId: string;
  username: string;
  /** VIGENTE / ANULADA (INDIVIDUAL) or the group display status (GRUPAL). */
  status: string;
  group: {
    code: string;
    cashDirection: 'IN' | 'OUT' | 'NONE';
    itemCount: number;
    authorizedAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    reservedAmount: number;
  } | null;
}

export interface TypeOperationFilters {
  transactionTypeId: string;
  modality?: OperationModality;
  startDate?: string;
  endDate?: string;
  status?: TypeEntryStatus;
  userId?: string;
  /** Description, beneficiary or group code. */
  search?: string;
  page: number;
  limit: number;
}

export interface TypeOperationSummary {
  individualCount: number;
  groupCount: number;
  /** Groups of the filtered set: still reserved, paid and still to execute. */
  groupReserved: number;
  groupPaid: number;
  groupOutstanding: number;
}

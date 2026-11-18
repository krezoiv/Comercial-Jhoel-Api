/**
 * Listas Escolares — official templates per grade, customer quotations and
 * their account statement (API `/school-lists`, migration 1760007900000).
 * The backend computes and validates every amount; these types only mirror
 * its responses.
 */

export type SchoolQuotationStatus =
  | 'BORRADOR'
  | 'COTIZADA'
  | 'ANTICIPO_RECIBIDO'
  | 'PAGO_PARCIAL'
  | 'PAGADA'
  | 'EN_PREPARACION'
  | 'TERMINADA'
  | 'ENTREGADA'
  | 'CANCELADA';

export type SchoolAccountStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'CERRADA';
export type SchoolPaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'DEPOSITO' | 'TARJETA' | 'OTRO';
export type SchoolPaymentKind = 'ANTICIPO' | 'ABONO' | 'DEVOLUCION' | 'ANULACION';
/** TERMINAR = the list is packed and dispatched, ready to hand over. */
export type SchoolStatusAction = 'CONFIRMAR' | 'PREPARAR' | 'TERMINAR' | 'ENTREGAR';
export type SchoolLineSource = 'PLANTILLA' | 'INVENTARIO' | 'MANUAL';

export type SchoolListPermission =
  | 'school_lists.view'
  | 'school_lists.templates.manage'
  | 'school_lists.quotations.create'
  | 'school_lists.quotations.edit'
  | 'school_lists.prices.override'
  | 'school_lists.payments.register'
  | 'school_lists.payments.void'
  | 'school_lists.statements.view'
  | 'school_lists.quotations.cancel'
  | 'school_lists.documents.generate';

export const SCHOOL_STATUS_LABEL: Record<SchoolQuotationStatus, string> = {
  BORRADOR: 'Borrador',
  COTIZADA: 'Cotizada',
  ANTICIPO_RECIBIDO: 'Anticipo recibido',
  PAGO_PARCIAL: 'Pago parcial',
  PAGADA: 'Pagada',
  EN_PREPARACION: 'En preparación',
  TERMINADA: 'Terminada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
};

export const SCHOOL_STATUS_TONE: Record<
  SchoolQuotationStatus,
  'brand' | 'gold' | 'success' | 'danger' | 'neutral-dark' | 'neutral-light'
> = {
  BORRADOR: 'neutral-light',
  COTIZADA: 'danger',
  ANTICIPO_RECIBIDO: 'gold',
  PAGO_PARCIAL: 'gold',
  PAGADA: 'success',
  EN_PREPARACION: 'brand',
  TERMINADA: 'neutral-dark',
  ENTREGADA: 'success',
  CANCELADA: 'neutral-light',
};

export const SCHOOL_STATUSES = Object.keys(SCHOOL_STATUS_LABEL) as SchoolQuotationStatus[];

export const SCHOOL_PAYMENT_METHOD_LABEL: Record<SchoolPaymentMethod, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  DEPOSITO: 'Depósito bancario',
  TARJETA: 'Tarjeta',
  OTRO: 'Otro',
};

export const SCHOOL_PAYMENT_METHODS = Object.keys(SCHOOL_PAYMENT_METHOD_LABEL) as SchoolPaymentMethod[];

export const SCHOOL_PAYMENT_KIND_LABEL: Record<SchoolPaymentKind, string> = {
  ANTICIPO: 'Anticipo',
  ABONO: 'Abono',
  DEVOLUCION: 'Devolución',
  ANULACION: 'Anulación',
};

export const SCHOOL_LINE_SOURCE_LABEL: Record<SchoolLineSource, string> = {
  PLANTILLA: 'Plantilla',
  INVENTARIO: 'Inventario',
  MANUAL: 'Agregado',
};

/** Green = paid, yellow = partial, red = pending; cancelled is neutral. */
export const SCHOOL_ACCOUNT_TONE: Record<SchoolAccountStatus, 'success' | 'gold' | 'danger' | 'neutral-light'> = {
  PAGADA: 'success',
  PARCIAL: 'gold',
  PENDIENTE: 'danger',
  CERRADA: 'neutral-light',
};

export const SCHOOL_ACCOUNT_LABEL: Record<SchoolAccountStatus, string> = {
  PAGADA: 'Pagada',
  PARCIAL: 'Pago parcial',
  PENDIENTE: 'Saldo pendiente',
  CERRADA: 'Cerrada',
};

/** Methods that may name the bank account the money arrived to. */
export const SCHOOL_BANK_METHODS: readonly SchoolPaymentMethod[] = ['TRANSFERENCIA', 'DEPOSITO'];

/** States in which lines, customer data and observations may still change. */
export function isSchoolQuotationEditable(status: SchoolQuotationStatus): boolean {
  return status !== 'ENTREGADA' && status !== 'CANCELADA';
}

export function canReceiveSchoolPayment(status: SchoolQuotationStatus): boolean {
  return status !== 'BORRADOR' && status !== 'ENTREGADA' && status !== 'CANCELADA';
}

// ── Templates ──────────────────────────────────────────────────────────────
export interface SchoolTemplateItem {
  id: string;
  lineNo: number;
  productId: string | null;
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  observations: string | null;
  inventoryPrice: number | null;
}

export interface SchoolTemplateSummary {
  id: string;
  name: string;
  grade: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  version: number;
  itemCount: number;
  total: number;
  updatedAt: string;
  updatedByUsername: string | null;
}

export interface SchoolTemplate extends SchoolTemplateSummary {
  items: SchoolTemplateItem[];
}

export interface SchoolTemplateItemInput {
  productId?: string | null;
  productName: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  observations?: string | null;
}

export interface SaveSchoolTemplateInput {
  name: string;
  grade: string;
  description?: string | null;
  isActive?: boolean;
  items: SchoolTemplateItemInput[];
  version?: number;
}

// ── Quotations ─────────────────────────────────────────────────────────────
export interface SchoolQuotationItem {
  id: string;
  lineNo: number;
  source: SchoolLineSource;
  templateItemId: string | null;
  productId: string | null;
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  observations: string | null;
}

export interface SchoolPayment {
  id: string;
  quotationId: string;
  receiptNumber: string;
  kind: SchoolPaymentKind;
  amount: number;
  effect: number;
  runningBalance: number;
  paymentMethod: SchoolPaymentMethod;
  bankId: string | null;
  bankName: string | null;
  reference: string | null;
  observations: string | null;
  status: 'APLICADO' | 'ANULADO';
  reversalOfId: string | null;
  receivedAt: string;
  receivedByUsername: string;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface SchoolHistoryEntry {
  id: number;
  action: string;
  fromStatus: SchoolQuotationStatus | null;
  toStatus: SchoolQuotationStatus | null;
  details: Record<string, unknown>;
  createdAt: string;
  createdByUsername: string;
}

export interface SchoolAccount {
  total: number;
  advances: number;
  installments: number;
  refunds: number;
  paid: number;
  balance: number;
}

export interface SchoolQuotationSummary {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  deliveryDate: string | null;
  customerName: string;
  customerPhone: string;
  studentName: string | null;
  grade: string;
  templateId: string | null;
  templateName: string | null;
  total: number;
  paid: number;
  balance: number;
  status: SchoolQuotationStatus;
  accountStatus: SchoolAccountStatus;
  version: number;
  createdAt: string;
  createdByUsername: string;
}

export interface SchoolQuotation extends SchoolQuotationSummary {
  subtotal: number;
  discount: number;
  observations: string | null;
  updatedAt: string;
  finishedAt: string | null;
  finishedByUsername: string | null;
  deliveredAt: string | null;
  deliveredByUsername: string | null;
  cancelledAt: string | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  items: SchoolQuotationItem[];
  payments: SchoolPayment[];
  history: SchoolHistoryEntry[];
  account: SchoolAccount;
}

export interface SchoolQuotationItemInput {
  itemId?: string | null;
  templateItemId?: string | null;
  productId?: string | null;
  productName: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  discount?: number;
  observations?: string | null;
}

export interface SchoolPaymentInput {
  amount: number;
  paymentMethod: SchoolPaymentMethod;
  bankId?: string | null;
  reference?: string | null;
  observations?: string | null;
}

export interface SchoolQuotationInput {
  customerName: string;
  customerPhone: string;
  studentName?: string | null;
  quotationDate?: string;
  deliveryDate?: string | null;
  observations?: string | null;
  items: SchoolQuotationItemInput[];
}

export interface CreateSchoolQuotationInput extends SchoolQuotationInput {
  templateId?: string | null;
  grade?: string;
  asDraft?: boolean;
  advance?: SchoolPaymentInput | null;
  clientRequestId: string;
}

export interface SchoolCancelInput {
  reason: string;
  refundMethod?: SchoolPaymentMethod;
  bankId?: string | null;
  reference?: string | null;
  clientRequestId: string;
}

export interface SchoolQuotationFilters {
  search?: string;
  phone?: string;
  number?: string;
  grade?: string;
  status?: SchoolQuotationStatus | '';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface SchoolQuotationPage {
  items: SchoolQuotationSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface SchoolDashboard {
  dateFrom: string;
  dateTo: string;
  totalQuotations: number;
  pendingQuotations: number;
  paidQuotations: number;
  totalQuoted: number;
  totalReceived: number;
  pendingBalance: number;
  byGrade: { grade: string; count: number; total: number }[];
  byStatus: { status: SchoolQuotationStatus; count: number }[];
  incomeByDay: { date: string; amount: number }[];
}

export const SCHOOL_HISTORY_LABEL: Record<string, string> = {
  CREADA: 'Cotización creada',
  EDITADA: 'Cotización modificada',
  OBSERVACIONES: 'Observaciones actualizadas',
  PAGO: 'Pago registrado',
  PAGO_ANULADO: 'Pago anulado',
  CONFIRMAR: 'Borrador confirmado',
  PREPARAR: 'En preparación',
  TERMINAR: 'Terminada · despachada, lista para entregar',
  ENTREGAR: 'Entregada al cliente',
  CANCELADA: 'Cotización cancelada',
};

/** Rounds to cents the same way the backend does (display/live totals only). */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** `yyyy-MM-dd` → `dd/mm/yyyy` without a `Date` round-trip. */
export function formatSchoolDate(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function formatSchoolDateTime(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleString('es-GT', {
    timeZone: 'America/Guatemala',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Today in Guatemala as `yyyy-MM-dd`. */
export function guatemalaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export const SCHOOL_LIST_REPOSITORY = Symbol('SCHOOL_LIST_REPOSITORY');

export const SCHOOL_QUOTATION_STATUSES = [
  'BORRADOR',
  'COTIZADA',
  'ANTICIPO_RECIBIDO',
  'PAGO_PARCIAL',
  'PAGADA',
  'EN_PREPARACION',
  'ENTREGADA',
  'CANCELADA',
] as const;
export type SchoolQuotationStatus = (typeof SCHOOL_QUOTATION_STATUSES)[number];

export const SCHOOL_PAYMENT_METHODS = [
  'EFECTIVO',
  'TRANSFERENCIA',
  'DEPOSITO',
  'TARJETA',
  'OTRO',
] as const;
export type SchoolPaymentMethod = (typeof SCHOOL_PAYMENT_METHODS)[number];

export const SCHOOL_STATUS_ACTIONS = [
  'CONFIRMAR',
  'PREPARAR',
  'ENTREGAR',
] as const;
export type SchoolStatusAction = (typeof SCHOOL_STATUS_ACTIONS)[number];

export type SchoolPaymentKind =
  'ANTICIPO' | 'ABONO' | 'DEVOLUCION' | 'ANULACION';
export type SchoolLineSource = 'PLANTILLA' | 'INVENTARIO' | 'MANUAL';

/** Red / yellow / green account status shown next to every quotation. */
export type SchoolAccountStatus =
  'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'CERRADA';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Templates ──────────────────────────────────────────────────────────────
export interface TemplateItemInput {
  productId?: string | null;
  productName: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  observations?: string | null;
}

export interface TemplateInput {
  name: string;
  grade: string;
  description?: string | null;
  isActive?: boolean;
  items: TemplateItemInput[];
}

export interface TemplateItemRow {
  id: string;
  lineNo: number;
  productId: string | null;
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  observations: string | null;
  /** Current public price of the linked inventory product (null for free-text lines). */
  inventoryPrice: number | null;
}

export interface TemplateSummaryRow {
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

export interface TemplateRow extends TemplateSummaryRow {
  items: TemplateItemRow[];
}

// ── Quotations ─────────────────────────────────────────────────────────────
export interface QuotationItemInput {
  /** Id of a line already saved in this quotation (edits keep its price reference). */
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

export interface PaymentInput {
  amount: number;
  paymentMethod: SchoolPaymentMethod;
  bankId?: string | null;
  reference?: string | null;
  observations?: string | null;
}

export interface QuotationInput {
  templateId?: string | null;
  grade?: string | null;
  customerName: string;
  customerPhone: string;
  studentName?: string | null;
  quotationDate?: string | null;
  deliveryDate?: string | null;
  observations?: string | null;
  asDraft?: boolean;
  advance?: PaymentInput | null;
  items: QuotationItemInput[];
}

export interface QuotationSummaryRow {
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

export interface QuotationItemRow {
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

export interface PaymentRow {
  id: string;
  quotationId: string;
  receiptNumber: string;
  kind: SchoolPaymentKind;
  amount: number;
  /** Effect on the amount paid: +amount, −amount for a devolución or an anulación. */
  effect: number;
  /** Balance right after this movement, against the quotation's current total. */
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

export interface HistoryRow {
  id: number;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  details: Record<string, unknown>;
  createdAt: string;
  createdByUsername: string;
}

export interface AccountSummary {
  total: number;
  advances: number;
  installments: number;
  refunds: number;
  paid: number;
  balance: number;
}

export interface QuotationDetailRow extends QuotationSummaryRow {
  subtotal: number;
  discount: number;
  observations: string | null;
  updatedAt: string;
  deliveredAt: string | null;
  deliveredByUsername: string | null;
  cancelledAt: string | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  items: QuotationItemRow[];
  payments: PaymentRow[];
  history: HistoryRow[];
  account: AccountSummary;
}

export interface FindQuotationsOptions {
  search?: string;
  phone?: string;
  number?: string;
  grade?: string;
  status?: SchoolQuotationStatus;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface DashboardRow {
  totalQuotations: number;
  pendingQuotations: number;
  paidQuotations: number;
  totalQuoted: number;
  totalReceived: number;
  pendingBalance: number;
  byGrade: { grade: string; count: number; total: number }[];
  incomeByDay: { date: string; amount: number }[];
  byStatus: { status: SchoolQuotationStatus; count: number }[];
}

export interface CancelInput {
  reason: string;
  refundMethod?: SchoolPaymentMethod | null;
  bankId?: string | null;
  reference?: string | null;
}

/**
 * Port of Listas Escolares. Writes go only through the SQL functions of
 * migration 1760007900000 (they lock, validate and audit); reads are plain
 * parameterized queries.
 */
export interface SchoolListRepository {
  listTemplates(includeInactive: boolean): Promise<TemplateSummaryRow[]>;
  getTemplate(id: string): Promise<TemplateRow | null>;
  saveTemplate(
    id: string | null,
    input: TemplateInput,
    userId: string,
    expectedVersion: number | null,
  ): Promise<string>;
  setTemplateActive(
    id: string,
    active: boolean,
    userId: string,
  ): Promise<string>;
  duplicateTemplate(
    id: string,
    name: string,
    grade: string | null,
    userId: string,
  ): Promise<string>;

  findQuotations(
    options: FindQuotationsOptions,
  ): Promise<Paginated<QuotationSummaryRow>>;
  getQuotation(id: string): Promise<QuotationDetailRow | null>;
  createQuotation(
    input: QuotationInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;
  updateQuotation(
    id: string,
    input: QuotationInput,
    userId: string,
    expectedVersion: number,
  ): Promise<string>;
  setObservations(
    id: string,
    observations: string | null,
    userId: string,
    expectedVersion: number,
  ): Promise<string>;
  changeStatus(
    id: string,
    action: SchoolStatusAction,
    userId: string,
    expectedVersion: number | null,
  ): Promise<string>;
  cancelQuotation(
    id: string,
    input: CancelInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;

  registerPayment(
    quotationId: string,
    input: PaymentInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;
  voidPayment(
    paymentId: string,
    reason: string,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;
  findPayment(paymentId: string): Promise<PaymentRow | null>;

  dashboard(dateFrom: string, dateTo: string): Promise<DashboardRow>;
}

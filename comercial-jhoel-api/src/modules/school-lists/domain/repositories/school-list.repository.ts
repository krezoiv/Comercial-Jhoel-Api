export const SCHOOL_LIST_REPOSITORY = Symbol('SCHOOL_LIST_REPOSITORY');

export const SCHOOL_QUOTATION_STATUSES = [
  'BORRADOR',
  'ACEPTADA',
  'COTIZADA',
  'ANTICIPO_RECIBIDO',
  'PAGO_PARCIAL',
  'PAGADA',
  'EN_PREPARACION',
  'TERMINADA',
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
  'TERMINAR',
  'ENTREGAR',
] as const;
export type SchoolStatusAction = (typeof SCHOOL_STATUS_ACTIONS)[number];

/**
 * How a list reaches inventory (migration 1760008400000):
 *  - CONFIRMACION: lists saved before the requirements flow; inventory lines
 *    are discounted from Bodega when the list is confirmed (FIFO supply).
 *  - PREPARACION: lines are school requirements; inventory products are
 *    assigned while preparing and discounted once at "Finalizar preparación".
 */
export type SchoolFulfillmentMode = 'CONFIRMACION' | 'PREPARACION';

export type SchoolPaymentKind =
  'ANTICIPO' | 'ABONO' | 'DEVOLUCION' | 'ANULACION';
export type SchoolLineSource = 'PLANTILLA' | 'INVENTARIO' | 'MANUAL';

/** Supply state of a list (independent of its commercial status). */
export const SCHOOL_SUPPLY_STATUSES = [
  'PENDIENTE',
  'PARCIAL',
  'DISPONIBLE',
  'DESPACHADA',
  'NO_APLICA',
] as const;
export type SchoolSupplyStatus = (typeof SCHOOL_SUPPLY_STATUSES)[number];
export type SupplyProductStatus = 'PENDIENTE' | 'PARCIAL' | 'ABASTECIDO';
export type SupplyAllocationMode = 'FIFO_AUTO' | 'MANUAL';

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
  /** SKU of the linked inventory product (null for free-text lines or a product without one). */
  productSku: string | null;
  /** Category of the linked inventory product, read from `products.category_id` (null for free-text lines). */
  categoryId: string | null;
  categoryName: string | null;
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
  /** Applied anticipos (ANTICIPO payments that were not voided). */
  advance: number;
  paid: number;
  balance: number;
  status: SchoolQuotationStatus;
  fulfillmentMode: SchoolFulfillmentMode;
  accountStatus: SchoolAccountStatus;
  supplyStatus: SchoolSupplyStatus;
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
  /** SKU of the linked inventory product (null for free-text lines or a product without one). */
  productSku: string | null;
  /** Category of the linked inventory product, read from `products.category_id` (null for free-text lines). */
  categoryId: string | null;
  categoryName: string | null;
  /** Inventory products chosen in preparation to fulfil this requirement (new flow). */
  assignments: ItemAssignmentRow[];
}

/**
 * Inventory product assigned to a requirement. Internal, operational data:
 * it never replaces the requirement text nor its quoted price.
 */
export interface ItemAssignmentRow {
  id: string;
  productId: string;
  productName: string;
  productSku: string | null;
  categoryName: string | null;
  quantity: number;
  /** Current public price of the product (reference only; the quoted price stays). */
  referencePrice: number;
  /** Current Bodega stock of the product. */
  bodegaStock: number;
  productActive: boolean;
  createdAt: string;
  createdByUsername: string;
  updatedAt: string | null;
  updatedByUsername: string | null;
}

export interface PreparationAssignmentInput {
  itemId: string;
  productId: string;
  quantity: number;
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

/** Inventory movement caused by the list (discount, adjustment or return in Bodega). */
export interface ListInventoryMovementRow {
  id: string;
  productId: string;
  productName: string;
  movementType:
    'SALIDA_LISTA_ESCOLAR' | 'ENTRADA_AJUSTE_LISTA' | 'ENTRADA_ANULACION_LISTA';
  quantity: number;
  reason: string | null;
  createdAt: string;
  username: string;
}

/** One inventory product of a list: committed, reserved (allocated), pending, delivered. */
export interface SupplyLineRow {
  productId: string;
  productName: string;
  requested: number;
  allocated: number;
  pending: number;
  delivered: number;
}

export interface SupplyAllocationRow {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sourceType: 'EXISTENCIA' | 'COMPRA' | 'TRASLADO' | 'DEVOLUCION';
  mode: 'AUTO' | 'FIFO_MANUAL' | 'MANUAL';
  status: 'ASIGNADA' | 'LIBERADA' | 'ENTREGADA';
  purchaseId: string | null;
  purchaseInvoice: string | null;
  purchaseDate: string | null;
  createdAt: string;
  username: string;
  releasedAt: string | null;
  releaseReason: string | null;
}

export interface DispatchRow {
  id: string;
  dispatchedAt: string;
  username: string;
  observations: string | null;
  items: {
    productId: string | null;
    productName: string;
    requested: number;
    supplied: number;
    delivered: number;
    inventoryControlled: boolean;
  }[];
}

export interface QuotationSupplyRow {
  status: SchoolSupplyStatus;
  confirmedAt: string | null;
  lines: SupplyLineRow[];
  /** Free-text lines: outside inventory control, never block dispatch. */
  uncontrolledLines: number;
  allocations: SupplyAllocationRow[];
  dispatch: DispatchRow | null;
}

export interface SupplyProductRow {
  productId: string;
  productName: string;
  sku: string | null;
  category: string;
  bodega: number;
  committed: number;
  allocated: number;
  pending: number;
  freeUnits: number;
  lists: number;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  status: SupplyProductStatus;
}

export interface SupplySummary {
  pendingProducts: number;
  pendingUnits: number;
  affectedLists: number;
  suppliedProducts: number;
  partialProducts: number;
}

export interface FindSupplyProductsOptions {
  search?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  quotationNumber?: string;
  status?: SupplyProductStatus;
  page: number;
  limit: number;
}

export interface SupplyProductListRow {
  quotationId: string;
  quotationNumber: string;
  customerName: string;
  grade: string;
  confirmedAt: string | null;
  committed: number;
  allocated: number;
  pending: number;
  supplyStatus: SchoolSupplyStatus;
}

/** Units of a purchase handed to school lists. */
export interface SupplyPurchaseRow {
  purchaseId: string;
  invoiceNumber: string | null;
  purchaseDate: string;
  productId: string;
  productName: string;
  purchased: number;
  allocated: number;
  lists: {
    quotationId: string;
    quotationNumber: string;
    customerName: string;
    quantity: number;
    status: string;
  }[];
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
  /** When the list was packed and dispatched (status TERMINADA). */
  finishedAt: string | null;
  finishedByUsername: string | null;
  deliveredAt: string | null;
  deliveredByUsername: string | null;
  cancelledAt: string | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  items: QuotationItemRow[];
  payments: PaymentRow[];
  history: HistoryRow[];
  inventory: ListInventoryMovementRow[];
  supply: QuotationSupplyRow;
  account: AccountSummary;
}

export interface FindQuotationsOptions {
  supplyStatus?: SchoolSupplyStatus;
  search?: string;
  phone?: string;
  number?: string;
  grade?: string;
  status?: SchoolQuotationStatus;
  dateFrom?: string;
  dateTo?: string;
  /** Column to order by (whitelisted in the DTO); default: newest first. */
  sortBy?: QuotationSortField;
  sortDirection?: 'asc' | 'desc';
  page: number;
  limit: number;
}

/** Sortable columns of the quotation list. */
export const QUOTATION_SORT_FIELDS = [
  'number',
  'customer',
  'grade',
  'date',
  'total',
  'balance',
  'status',
] as const;
export type QuotationSortField = (typeof QUOTATION_SORT_FIELDS)[number];

export interface DashboardRow {
  totalQuotations: number;
  /** BORRADOR, COTIZADA or ACEPTADA: not being prepared yet. */
  awaitingQuotations: number;
  pendingQuotations: number;
  paidQuotations: number;
  totalQuoted: number;
  totalReceived: number;
  pendingBalance: number;
  byGrade: { grade: string; count: number; total: number }[];
  incomeByDay: { date: string; amount: number }[];
  byStatus: { status: SchoolQuotationStatus; count: number }[];
}

/**
 * What "Borrar todas las cotizaciones" removes (preview) or removed (result):
 * counts, and the units each product gets back in Bodega.
 */
export interface PurgeSummary {
  quotations: number;
  payments: number;
  movements: number;
  allocations: number;
  dispatches: number;
  returnedUnits: number;
  returned: { productId: string; product: string; units: number }[];
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
  /** Replaces the inventory assignments of a list in EN_PREPARACION (moves no stock). */
  savePreparation(
    id: string,
    assignments: PreparationAssignmentInput[],
    userId: string,
    expectedVersion: number,
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

  /** Counts of what a purge would delete and return to Bodega (read only). */
  purgePreview(): Promise<PurgeSummary>;
  /** HARD delete of every quotation (`purge_school_quotations`); returns what was removed. */
  purgeQuotations(userId: string, confirmation: string): Promise<PurgeSummary>;

  // ── Supply ──
  supplyProducts(
    options: FindSupplyProductsOptions,
  ): Promise<Paginated<SupplyProductRow> & { summary: SupplySummary }>;
  supplyProductLists(productId: string): Promise<SupplyProductListRow[]>;
  supplyPurchases(options: {
    purchaseId?: string;
    page: number;
    limit: number;
  }): Promise<Paginated<SupplyPurchaseRow>>;
  supplyMode(): Promise<SupplyAllocationMode>;
  setSupplyMode(
    mode: SupplyAllocationMode,
    userId: string,
  ): Promise<SupplyAllocationMode>;
  runFifo(productId: string | null, userId: string): Promise<number>;
  allocatePurchase(purchaseId: string, userId: string): Promise<number>;
  allocateManual(
    input: {
      quotationId: string;
      productId: string;
      quantity: number;
      purchaseId: string | null;
    },
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;
  dispatch(
    quotationId: string,
    observations: string | null,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;

  /** Current Bodega stock of the given products (where lists take their stock from). */
  bodegaStock(
    productIds: string[],
  ): Promise<{ productId: string; quantity: number }[]>;
}

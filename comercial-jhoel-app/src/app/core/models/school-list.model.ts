/**
 * Listas Escolares — official templates per grade, customer quotations and
 * their account statement (API `/school-lists`, migration 1760007900000).
 * The backend computes and validates every amount; these types only mirror
 * its responses.
 */

export type SchoolQuotationStatus =
  | 'BORRADOR'
  | 'ACEPTADA'
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
/**
 * ACEPTAR = the customer accepts a quotation (COTIZADA → ACEPTADA, migration
 * 1760009000000); only then can it be paid or prepared. TERMINAR = the list is
 * packed and dispatched, ready to hand over.
 */
export type SchoolStatusAction = 'CONFIRMAR' | 'ACEPTAR' | 'PREPARAR' | 'TERMINAR' | 'ENTREGAR';
export type SchoolLineSource = 'PLANTILLA' | 'INVENTARIO' | 'MANUAL';
/**
 * How a list reaches inventory (migration 1760008400000):
 * CONFIRMACION = lists saved before the requirements flow (Bodega discounted
 * at confirmation); PREPARACION = lines are school requirements, products are
 * assigned while preparing and discounted once at "Finalizar preparación".
 */
export type SchoolFulfillmentMode = 'CONFIRMACION' | 'PREPARACION';

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
  | 'school_lists.supply.manage'
  | 'school_lists.documents.generate'
  | 'school_lists.quotations.purge'
  | 'school_lists.quotations.delete'
  // "Devolver a cotización" — managers only (backend migration 1760009000000).
  | 'school_lists.quotations.revert'
  // Caja de Listas Escolares (backend migration 1760008700000).
  | 'school_lists.cash.view'
  | 'school_lists.cash.reports'
  | 'school_lists.cash.count'
  | 'school_lists.cash.transfer'
  | 'school_lists.cash.exit'
  | 'school_lists.cash.adjust'
  | 'school_lists.cash.authorize'
  | 'school_lists.customers.view'
  | 'school_lists.customers.export';

export const SCHOOL_STATUS_LABEL: Record<SchoolQuotationStatus, string> = {
  BORRADOR: 'Borrador',
  ACEPTADA: 'Aceptada',
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
  ACEPTADA: 'brand',
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

/**
 * Statuses of a list the customer accepted (mirror of the backend's
 * `school_quotation_status_accepted`, migration 1760009000000). Only these
 * count as sold or owed; BORRADOR and COTIZADA are quotations (never money)
 * and CANCELADA is closed.
 */
export const SCHOOL_ACCEPTED_STATUSES: readonly SchoolQuotationStatus[] = [
  'ACEPTADA',
  'ANTICIPO_RECIBIDO',
  'PAGO_PARCIAL',
  'PAGADA',
  'EN_PREPARACION',
  'TERMINADA',
  'ENTREGADA',
];

export function isAcceptedSchoolStatus(status: SchoolQuotationStatus): boolean {
  return SCHOOL_ACCEPTED_STATUSES.includes(status);
}

/** Backend message when a payment is attempted on a quotation (shown before calling it). */
export const SCHOOL_QUOTE_NOT_ACCEPTED_MESSAGE =
  'Esta lista todavía es una cotización. Debe ser aceptada por el cliente antes de registrar pagos.';

/**
 * Color key of each status pill (`.status-pill--<key>` in `_school-ui.scss`):
 * gray draft, blue quoted, teal accepted, purple anticipo, orange partial, green paid, sky
 * preparing, indigo finished, dark green delivered, red cancelled.
 */
export const SCHOOL_STATUS_COLOR: Record<SchoolQuotationStatus, string> = {
  BORRADOR: 'gray',
  ACEPTADA: 'teal',
  COTIZADA: 'blue',
  ANTICIPO_RECIBIDO: 'purple',
  PAGO_PARCIAL: 'orange',
  PAGADA: 'green',
  EN_PREPARACION: 'sky',
  TERMINADA: 'indigo',
  ENTREGADA: 'darkgreen',
  CANCELADA: 'red',
};

/** Supply state of a list (migration 1760008300000), independent of the commercial status. */
export type SchoolSupplyStatus = 'PENDIENTE' | 'PARCIAL' | 'DISPONIBLE' | 'DESPACHADA' | 'NO_APLICA';

export const SCHOOL_SUPPLY_LABEL: Record<SchoolSupplyStatus, string> = {
  PENDIENTE: 'Pendiente de abastecimiento',
  PARCIAL: 'Parcialmente abastecida',
  DISPONIBLE: 'Disponible para despacho',
  DESPACHADA: 'Despachada',
  NO_APLICA: 'Sin control',
};

export const SCHOOL_SUPPLY_TONE: Record<SchoolSupplyStatus, 'danger' | 'gold' | 'success' | 'brand' | 'neutral-light'> = {
  PENDIENTE: 'danger',
  PARCIAL: 'gold',
  DISPONIBLE: 'success',
  DESPACHADA: 'brand',
  NO_APLICA: 'neutral-light',
};

export const SCHOOL_SUPPLY_FILTERS: SchoolSupplyStatus[] = ['PENDIENTE', 'PARCIAL', 'DISPONIBLE', 'DESPACHADA'];

export type SupplyProductStatus = 'PENDIENTE' | 'PARCIAL' | 'ABASTECIDO';
export const SUPPLY_PRODUCT_LABEL: Record<SupplyProductStatus, string> = {
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Parcialmente abastecido',
  ABASTECIDO: 'Abastecido',
};
export const SUPPLY_PRODUCT_TONE: Record<SupplyProductStatus, 'danger' | 'gold' | 'success'> = {
  PENDIENTE: 'danger',
  PARCIAL: 'gold',
  ABASTECIDO: 'success',
};

export const SUPPLY_SOURCE_LABEL: Record<'EXISTENCIA' | 'COMPRA' | 'TRASLADO' | 'DEVOLUCION', string> = {
  EXISTENCIA: 'Existencia en Bodega',
  COMPRA: 'Compra',
  TRASLADO: 'Traslado',
  DEVOLUCION: 'Devolución',
};

export interface SupplyLine {
  productId: string;
  productName: string;
  requested: number;
  allocated: number;
  pending: number;
  delivered: number;
}

export interface SupplyAllocation {
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

export interface SchoolDispatch {
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

export interface QuotationSupply {
  status: SchoolSupplyStatus;
  confirmedAt: string | null;
  lines: SupplyLine[];
  uncontrolledLines: number;
  allocations: SupplyAllocation[];
  dispatch: SchoolDispatch | null;
}

export interface SupplyProduct {
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

export interface SupplyProductPage {
  items: SupplyProduct[];
  total: number;
  page: number;
  limit: number;
  summary: SupplySummary;
}

export interface SupplyProductFilters {
  search?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  quotationNumber?: string;
  status?: SupplyProductStatus | '';
  page?: number;
  limit?: number;
}

export interface SupplyProductList {
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

export interface SupplyPurchase {
  purchaseId: string;
  invoiceNumber: string | null;
  purchaseDate: string;
  productId: string;
  productName: string;
  purchased: number;
  allocated: number;
  lists: { quotationId: string; quotationNumber: string; customerName: string; quantity: number; status: string }[];
}

export type SupplyAllocationMode = 'FIFO_AUTO' | 'MANUAL';

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

/**
 * Accounts that cannot receive school-list money (credit lines, Districol and
 * Guayacán keep their own rules). The backend rejects them too
 * (`SCHOOL_CASH_BANK_NOT_ALLOWED`); the form simply does not offer them.
 */
const SCHOOL_EXCLUDED_ACCOUNTS: readonly string[] = ['GENESIS', 'BI_CLUB', 'DISTRICOL', 'GUAYACAN'];

export function isSchoolCashBank(bank: { isActive: boolean; specialAccount: string | null }): boolean {
  return bank.isActive && !SCHOOL_EXCLUDED_ACCOUNTS.includes(bank.specialAccount ?? '');
}

/**
 * Where the money of a list payment goes (Caja de Listas Escolares): cash
 * enters the caja, bank payments stay in the bank until "Transferir a Caja de
 * Listas", card/other stay outside (counted as collected only).
 */
export function schoolPaymentDestination(method: SchoolPaymentMethod, bankName?: string | null): string {
  if (method === 'EFECTIVO') {
    return 'Entra a la Caja de Listas.';
  }
  if (SCHOOL_BANK_METHODS.includes(method)) {
    return bankName
      ? `Sube el saldo de ${bankName} y queda pendiente de trasladar a la Caja de Listas.`
      : 'Elija la cuenta que recibió el dinero: quedará pendiente de trasladar a la Caja de Listas.';
  }
  return 'Cuenta como recaudado, fuera de la Caja de Listas (otros medios).';
}

/**
 * States in which lines, customer data and observations may still change. A
 * list of the requirements flow is frozen once its preparation is finished
 * (TERMINADA already took its stock).
 */
export function isSchoolQuotationEditable(
  status: SchoolQuotationStatus,
  mode: SchoolFulfillmentMode = 'CONFIRMACION',
): boolean {
  return status !== 'ENTREGADA' && status !== 'CANCELADA' && !(mode === 'PREPARACION' && status === 'TERMINADA');
}

/**
 * Only an accepted list receives payments (migration 1760009000000): a
 * quotation (BORRADOR / COTIZADA) is accepted first; delivered or cancelled
 * lists are closed. The backend enforces it (SCHOOL_QUOTE_NOT_ACCEPTED).
 */
export function canReceiveSchoolPayment(status: SchoolQuotationStatus): boolean {
  return isAcceptedSchoolStatus(status) && status !== 'ENTREGADA';
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
  /** SKU of the linked inventory product (null for free-text lines). */
  productSku: string | null;
  /** Category from the product's real relation in the database (null for free-text lines). */
  categoryId: string | null;
  categoryName: string | null;
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
  /** SKU of the linked inventory product (null for free-text lines). */
  productSku: string | null;
  /** Category from the product's real relation in the database (null for free-text lines). */
  categoryId: string | null;
  categoryName: string | null;
  /** Inventory products chosen in preparation to fulfil this requirement (internal). */
  assignments: SchoolItemAssignment[];
}

/**
 * Inventory product assigned to a requirement while preparing the order. It
 * never replaces the requirement text nor its quoted price.
 */
export interface SchoolItemAssignment {
  id: string;
  productId: string;
  productName: string;
  productSku: string | null;
  categoryName: string | null;
  quantity: number;
  /** Current public price (reference only; the quoted price stays). */
  referencePrice: number;
  bodegaStock: number;
  productActive: boolean;
  createdAt: string;
  createdByUsername: string;
  updatedAt: string | null;
  updatedByUsername: string | null;
}

export interface SchoolPreparationAssignmentInput {
  itemId: string;
  productId: string;
  quantity: number;
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

/** Inventory movement caused by the list in Bodega (discount, adjustment or return). */
export interface SchoolListInventoryMovement {
  id: string;
  productId: string;
  productName: string;
  movementType: 'SALIDA_LISTA_ESCOLAR' | 'ENTRADA_AJUSTE_LISTA' | 'ENTRADA_ANULACION_LISTA';
  quantity: number;
  reason: string | null;
  createdAt: string;
  username: string;
}

export const SCHOOL_INVENTORY_MOVEMENT_LABEL: Record<SchoolListInventoryMovement['movementType'], string> = {
  SALIDA_LISTA_ESCOLAR: 'Salida por lista',
  ENTRADA_AJUSTE_LISTA: 'Devolución por ajuste',
  ENTRADA_ANULACION_LISTA: 'Devolución por anulación',
};

/** Statuses in which the list keeps its inventory lines discounted from Bodega. */
export function schoolListHoldsStock(status: SchoolQuotationStatus): boolean {
  return status !== 'BORRADOR' && status !== 'CANCELADA';
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
  /** Applied anticipos (not voided). */
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
  inventory: SchoolListInventoryMovement[];
  supply: QuotationSupply;
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
  supplyStatus?: SchoolSupplyStatus | '';
  /** "Aceptadas sin pagos": ACEPTADA, nothing paid, not prepared — to review one by one. */
  acceptedWithoutPayments?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: SchoolQuotationSortField;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/** Columns the backend can order the quotation list by (`GET /school-lists/quotations?sortBy=`). */
export type SchoolQuotationSortField = 'number' | 'customer' | 'grade' | 'date' | 'total' | 'balance' | 'status';

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
  /** Quotations pending the customer's decision (BORRADOR or COTIZADA). */
  awaitingQuotations: number;
  /** Accepted lists with a balance still to collect. */
  pendingQuotations: number;
  paidQuotations: number;
  totalQuoted: number;
  /** Total of the accepted lists (what was really sold). */
  acceptedTotal: number;
  /** Total of the quotations not accepted yet — never counted as money. */
  quotedPendingTotal: number;
  totalReceived: number;
  pendingBalance: number;
  byGrade: { grade: string; count: number; total: number }[];
  byStatus: { status: SchoolQuotationStatus; count: number }[];
  incomeByDay: { date: string; amount: number }[];
}

/** What "Borrar todas las cotizaciones" removes (preview) or removed (result). */
export interface SchoolPurgeSummary {
  quotations: number;
  payments: number;
  movements: number;
  allocations: number;
  dispatches: number;
  returnedUnits: number;
  returned: { productId: string; product: string; units: number }[];
}

/** Phrase the user types to confirm the purge (the backend checks it again). */
export const SCHOOL_PURGE_CONFIRMATION = 'BORRAR TODO';

export const SCHOOL_HISTORY_LABEL: Record<string, string> = {
  CREADA: 'Cotización creada',
  EDITADA: 'Cotización modificada',
  OBSERVACIONES: 'Observaciones actualizadas',
  PAGO: 'Pago registrado',
  PAGO_ANULADO: 'Pago anulado',
  CONFIRMAR: 'Borrador confirmado como cotización',
  ACEPTAR: 'Aceptada por el cliente',
  DEVUELTA_COTIZACION: 'Devuelta a cotización',
  PREPARAR: 'En preparación',
  PREPARACION: 'Productos de inventario asignados',
  TERMINAR: 'Terminada · despachada, lista para entregar',
  ENTREGAR: 'Entregada al cliente',
  CANCELADA: 'Lista anulada',
  ABASTECIMIENTO: 'Productos asignados (abastecimiento)',
  DESPACHO: 'Lista despachada y entregada',
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

// ── Product catalog for "Cambiar producto" ─────────────────────────────────
/**
 * Active inventory product as the change-product modal shows it. Read from the
 * existing `GET /products` (filtered by `categoryId` and `search`, paginated);
 * `bodega` is filled afterwards from `GET /school-lists/stock`, because lists
 * take their stock from Bodega.
 */
export interface SchoolCatalogProduct {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  publicPrice: number;
}

export interface SchoolCatalogPage {
  items: SchoolCatalogProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface SchoolCatalogFilters {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

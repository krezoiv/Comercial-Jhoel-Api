/**
 * Caja de Listas Escolares (migration 1760008700000). The SQL functions are
 * the only writers; this port exposes them and the read models built on the
 * official ledger `school_cash_movements` (the balance is never stored apart).
 */
export const SCHOOL_CASH_BOX_REPOSITORY = Symbol('SCHOOL_CASH_BOX_REPOSITORY');

export const SCHOOL_CASH_MOVEMENT_TYPES = [
  'PAGO_EFECTIVO',
  'PAGO_DEPOSITO',
  'PAGO_TRANSFERENCIA',
  'PAGO_OTRO_MEDIO',
  'TRASLADO_BANCO',
  'SALIDA',
  'AJUSTE',
  'DEVOLUCION',
  'REVERSION',
] as const;
export type SchoolCashMovementType =
  (typeof SCHOOL_CASH_MOVEMENT_TYPES)[number];

/** IN/OUT move the physical cash; NONE rows (bank or other media) only inform. */
export type SchoolCashDirection = 'IN' | 'OUT' | 'NONE';

export const SCHOOL_CASH_EXIT_DESTINATIONS = [
  'ENTREGA_ADMINISTRACION',
  'DEPOSITO_BANCARIO',
  'GASTO_AUTORIZADO',
  'OTRO',
] as const;
export type SchoolCashExitDestination =
  (typeof SCHOOL_CASH_EXIT_DESTINATIONS)[number];

export const SCHOOL_CASH_RECEIPT_STATUSES = [
  'PENDIENTE',
  'TRASLADO_PARCIAL',
  'TRASLADADO',
  'DEVUELTO',
  'ANULADO',
] as const;
export type SchoolCashReceiptStatus =
  (typeof SCHOOL_CASH_RECEIPT_STATUSES)[number];

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SchoolCashMovementRow {
  id: string;
  sequence: number;
  movementNumber: string;
  movementType: SchoolCashMovementType;
  direction: SchoolCashDirection;
  amount: number;
  /** Signed effect on the physical cash (0 for NONE rows). */
  cashEffect: number;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: string | null;
  quotationId: string | null;
  quotationNumber: string | null;
  customerName: string | null;
  paymentId: string | null;
  receiptNumber: string | null;
  bankId: string | null;
  bankName: string | null;
  transferId: string | null;
  transferNumber: string | null;
  exitId: string | null;
  exitNumber: string | null;
  description: string;
  reference: string | null;
  observations: string | null;
  businessDate: string;
  status: 'APLICADO' | 'REVERTIDO';
  reversalOfId: string | null;
  reversalOfNumber: string | null;
  reversedAt: string | null;
  reversedByName: string | null;
  reverseReason: string | null;
  userName: string;
  createdAt: string;
}

export interface SchoolCashReceiptRow {
  /** Ledger row id of the bank payment (what a transfer references). */
  id: string;
  movementNumber: string;
  paymentId: string | null;
  receiptNumber: string | null;
  quotationId: string | null;
  quotationNumber: string | null;
  customerName: string | null;
  paymentMethod: string | null;
  bankId: string;
  bankName: string;
  reference: string | null;
  amount: number;
  transferred: number;
  refunded: number;
  pending: number;
  transferStatus: SchoolCashReceiptStatus;
  receivedAt: string;
  userName: string;
}

export interface SchoolCashTransferItemRow {
  receiptId: string;
  receiptNumber: string | null;
  quotationNumber: string | null;
  customerName: string | null;
  amount: number;
}

export interface SchoolCashTransferRow {
  id: string;
  transferNumber: string;
  bankId: string;
  bankName: string;
  amount: number;
  businessDate: string;
  reference: string | null;
  observations: string | null;
  status: 'APLICADO' | 'ANULADO';
  userName: string;
  createdAt: string;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
  items: SchoolCashTransferItemRow[];
}

export interface SchoolCashExitRow {
  id: string;
  exitNumber: string;
  amount: number;
  destination: SchoolCashExitDestination;
  bankId: string | null;
  bankName: string | null;
  recipientName: string | null;
  reason: string;
  reference: string | null;
  businessDate: string;
  status: 'APLICADO' | 'ANULADO';
  authorizedByName: string;
  createdAt: string;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
}

export interface SchoolCashCountDetailRow {
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface SchoolCashCountRow {
  id: string;
  countNumber: string;
  theoreticalBalance: number;
  countedTotal: number;
  difference: number;
  status: 'CUADRADO' | 'FALTANTE' | 'SOBRANTE';
  lastMovementNumber: string | null;
  observations: string | null;
  businessDate: string;
  userName: string;
  createdAt: string;
  details: SchoolCashCountDetailRow[];
}

export interface SchoolCashPendingByBank {
  bankId: string;
  bankName: string;
  pending: number;
  receipts: number;
}

export type SummaryGranularity = 'day' | 'week' | 'month';

/** Optional period of the flow figures (sales, collected, transfers) and of the chart. */
export interface SummaryPeriod {
  from?: string;
  to?: string;
  granularity: SummaryGranularity;
}

export interface SchoolCashSeriesPoint {
  /** First day of the bucket (`yyyy-MM-dd`). */
  start: string;
  cash: number;
  bank: number;
  other: number;
  total: number;
}

/**
 * Every figure of the dashboard, each from its single source:
 * payments (`school_quotation_payments`) for what customers paid, the ledger
 * for the cash, the pending-receipts view for the banks, quotations for sales.
 */
export interface SchoolCashSummaryRow {
  /** Period of `sales`, `collected` and `transferred*` (null = the whole season). */
  period: {
    from: string | null;
    to: string | null;
    granularity: SummaryGranularity;
  };
  cashBalance: number;
  pendingTransfer: number;
  pendingReceipts: number;
  oldestPendingAt: string | null;
  transferredTotal: number;
  transfersCount: number;
  collected: {
    /** Net money customers paid (received − refunds), all time. */
    total: number;
    cash: number;
    transfer: number;
    deposit: number;
    other: number;
    refunds: number;
    advances: number;
    installments: number;
    /** Received before the Caja de Listas existed (never in the caja). */
    beforeCashBox: number;
  };
  /** ACCEPTED lists in the period (sold, not money — migration 1760009000000). */
  sales: { total: number; count: number };
  /** Quotations waiting for the customer's decision (COTIZADA), now — informative, never money. */
  quotes: { total: number; count: number };
  /** ACEPTADA lists with no payment and no preparation: candidates for "Devolver a cotización". */
  acceptedWithoutPayments: number;
  /** Owed on accepted lists only. */
  customersBalance: number;
  customersWithBalance: number;
  exitsTotal: number;
  adjustmentsNet: number;
  lastCount: SchoolCashCountRow | null;
  pendingByBank: SchoolCashPendingByBank[];
  /** Payments received per day/week/month (anulados excluded). */
  series: SchoolCashSeriesPoint[];
  /** Lists by payment state, now (drafts excluded). */
  portfolio: {
    lists: number;
    paid: number;
    partial: number;
    pending: number;
    cancelled: number;
    /** Quotations not accepted yet (outside every money figure). */
    quotes: number;
    quotesTotal: number;
    paidAmount: number;
    partialBalance: number;
    pendingBalance: number;
  };
  /** Customers (same phone digits) by account state, now. */
  customers: {
    total: number;
    withBalance: number;
    solvent: number;
    paying: number;
    notPaying: number;
  };
  recent: SchoolCashMovementRow[];
}

export type CustomerAccountStatus =
  'SOLVENTE' | 'ABONANDO' | 'PENDIENTE' | 'COTIZANDO' | 'CANCELADO';
export const CUSTOMER_VIEWS = [
  'ALL',
  'WITH_BALANCE',
  'SOLVENT',
  'NO_PAYMENTS',
  'WITH_PAYMENTS',
] as const;
export type CustomerView = (typeof CUSTOMER_VIEWS)[number];
export const CUSTOMER_SORTS = [
  'BALANCE',
  'PAID',
  'PURCHASED',
  'LAST_PAYMENT',
  'NAME',
] as const;
export type CustomerSort = (typeof CUSTOMER_SORTS)[number];

export interface CustomerFilters {
  search?: string;
  view: CustomerView;
  status?: CustomerAccountStatus;
  grade?: string;
  dateFrom?: string;
  dateTo?: string;
  sort: CustomerSort;
  page: number;
  limit: number;
}

/** A customer of Listas Escolares: every list with the same phone digits. */
export interface CustomerRow {
  key: string;
  name: string;
  phone: string;
  /** Other spellings of the name used in their lists. */
  otherNames: string[];
  students: string[];
  grades: string[];
  quotationNumbers: string[];
  lists: number;
  /** ACCEPTED lists — the only ones that count as bought and owed. */
  activeLists: number;
  purchased: number;
  paid: number;
  balance: number;
  /** Quotations still waiting for the customer's decision (no money). */
  quotes: number;
  quotedTotal: number;
  status: CustomerAccountStatus;
  lastPaymentAt: string | null;
  firstAt: string;
  /** Earliest delivery date of a list that still owes money (information only, not a due date). */
  nextDeliveryDate: string | null;
}

export interface CustomerPage extends Page<CustomerRow> {
  totals: {
    customers: number;
    purchased: number;
    paid: number;
    balance: number;
    byStatus: Record<CustomerAccountStatus, number>;
  };
}

export interface CustomerListRow {
  id: string;
  quotationNumber: string;
  studentName: string | null;
  grade: string;
  quotationDate: string;
  deliveryDate: string | null;
  status: string;
  total: number;
  paid: number;
  balance: number;
  itemCount: number;
  createdAt: string;
}

export interface CustomerPaymentRow {
  id: string;
  seq: number;
  quotationId: string;
  quotationNumber: string;
  studentName: string | null;
  receiptNumber: string;
  kind: string;
  amount: number;
  paymentMethod: string;
  bankName: string | null;
  reference: string | null;
  observations: string | null;
  balanceAfter: number;
  status: 'APLICADO' | 'ANULADO';
  reversedReceipt: string | null;
  receivedAt: string;
  receivedByName: string;
  voidedAt: string | null;
  voidedByName: string | null;
  voidReason: string | null;
  /** Where the money went: CAJA, BANCO (with its transfer state), OTRO medio, or ANTERIOR (before the caja). */
  destination: 'CAJA' | 'BANCO' | 'OTRO' | 'ANTERIOR' | null;
  transferStatus: string | null;
  pendingTransfer: number | null;
}

export interface CustomerHistoryRow {
  seq: number;
  quotationId: string;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface CustomerDetailRaw {
  customer: CustomerRow;
  /** Every list of the customer, drafts included (they do not count). */
  lists: CustomerListRow[];
  payments: CustomerPaymentRow[];
  history: CustomerHistoryRow[];
}

export interface PaymentFilters {
  dateFrom?: string;
  dateTo?: string;
  method?: string;
  kind?: string;
  status?: 'APLICADO' | 'ANULADO';
  bankId?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface PaymentPage extends Page<
  CustomerPaymentRow & { customerName: string; customerPhone: string }
> {
  totals: { received: number; refunds: number; voided: number };
}

export interface MovementFilters {
  dateFrom?: string;
  dateTo?: string;
  movementType?: SchoolCashMovementType;
  search?: string;
  bankId?: string;
  userId?: string;
  page: number;
  limit: number;
}

export interface ReceiptFilters {
  bankId?: string;
  /** `OPEN` (default): still pending; `ALL`: every bank receipt. */
  scope: 'OPEN' | 'ALL';
  search?: string;
}

export interface DateRangeFilters {
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface CashUser {
  id: string;
  name: string;
}

export interface TransferInput {
  bankId: string;
  items: { movementId: string; amount: number }[];
  reference?: string | null;
  observations?: string | null;
}

export interface ExitInput {
  amount: number;
  destination: SchoolCashExitDestination;
  bankId?: string | null;
  recipientName?: string | null;
  reason: string;
  reference?: string | null;
}

export interface AdjustmentInput {
  direction: 'IN' | 'OUT';
  amount: number;
  reason: string;
}

export interface CountInput {
  details: { denomination: number; quantity: number }[];
  observations?: string | null;
}

/** A tabular report: typed values per column key. */
export type ReportValue = string | number | null;
export type ReportRecord = Record<string, ReportValue>;

export interface SchoolCashBoxRepository {
  summary(today: string, period: SummaryPeriod): Promise<SchoolCashSummaryRow>;
  listCustomers(filters: CustomerFilters): Promise<CustomerPage>;
  /** `key` = phone digits. */
  findCustomer(key: string): Promise<CustomerDetailRaw | null>;
  listPayments(filters: PaymentFilters): Promise<PaymentPage>;
  balance(): Promise<number>;
  listMovements(filters: MovementFilters): Promise<Page<SchoolCashMovementRow>>;
  findMovement(id: string): Promise<SchoolCashMovementRow | null>;
  listReceipts(filters: ReceiptFilters): Promise<SchoolCashReceiptRow[]>;
  listTransfers(
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashTransferRow>>;
  findTransfer(id: string): Promise<SchoolCashTransferRow | null>;
  listExits(filters: DateRangeFilters): Promise<Page<SchoolCashExitRow>>;
  findExit(id: string): Promise<SchoolCashExitRow | null>;
  listCounts(filters: DateRangeFilters): Promise<Page<SchoolCashCountRow>>;
  findCount(id: string): Promise<SchoolCashCountRow | null>;
  listUsers(): Promise<CashUser[]>;
  /** Total of list money still in banks (the agents' cuadre subtracts it). */
  pendingTotal(): Promise<number>;

  registerTransfer(
    input: TransferInput,
    userId: string,
    key: string,
  ): Promise<string>;
  voidTransfer(id: string, reason: string, userId: string): Promise<string>;
  registerExit(input: ExitInput, userId: string, key: string): Promise<string>;
  voidExit(id: string, reason: string, userId: string): Promise<string>;
  registerAdjustment(
    input: AdjustmentInput,
    userId: string,
    key: string,
  ): Promise<string>;
  voidAdjustment(
    movementId: string,
    reason: string,
    userId: string,
  ): Promise<string>;
  registerCount(
    input: CountInput,
    userId: string,
    key: string,
  ): Promise<string>;

  /** Raw rows of one report kind for a Guatemala date range (inclusive). */
  reportRows(
    kind: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<ReportRecord[]>;
}

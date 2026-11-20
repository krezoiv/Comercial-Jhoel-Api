/**
 * Caja de Listas Escolares (backend `/school-cash-box`, migration
 * 1760008700000). Every figure comes from the backend; the app never
 * recomputes balances.
 */

export type SchoolCashMovementType =
  | 'PAGO_EFECTIVO'
  | 'PAGO_DEPOSITO'
  | 'PAGO_TRANSFERENCIA'
  | 'PAGO_OTRO_MEDIO'
  | 'TRASLADO_BANCO'
  | 'SALIDA'
  | 'AJUSTE'
  | 'DEVOLUCION'
  | 'REVERSION';

/** IN/OUT move the physical cash; NONE (bank or other media) only informs. */
export type SchoolCashDirection = 'IN' | 'OUT' | 'NONE';

export type SchoolCashExitDestination = 'ENTREGA_ADMINISTRACION' | 'DEPOSITO_BANCARIO' | 'GASTO_AUTORIZADO' | 'OTRO';

export type SchoolCashReceiptStatus = 'PENDIENTE' | 'TRASLADO_PARCIAL' | 'TRASLADADO' | 'DEVUELTO' | 'ANULADO';

export const SCHOOL_CASH_MOVEMENT_LABEL: Record<SchoolCashMovementType, string> = {
  PAGO_EFECTIVO: 'Pago de lista en efectivo',
  PAGO_DEPOSITO: 'Pago de lista por depósito',
  PAGO_TRANSFERENCIA: 'Pago de lista por transferencia',
  PAGO_OTRO_MEDIO: 'Pago por otro medio',
  TRASLADO_BANCO: 'Traslado de banco a caja',
  SALIDA: 'Salida de caja',
  AJUSTE: 'Ajuste autorizado',
  DEVOLUCION: 'Devolución al cliente',
  REVERSION: 'Reversión de movimiento',
};

export const SCHOOL_CASH_MOVEMENT_TYPES = Object.keys(SCHOOL_CASH_MOVEMENT_LABEL) as SchoolCashMovementType[];

/** Icon of each movement type in the Kardex. */
export const SCHOOL_CASH_MOVEMENT_ICON: Record<SchoolCashMovementType, string> = {
  PAGO_EFECTIVO: 'wallet',
  PAGO_DEPOSITO: 'bank',
  PAGO_TRANSFERENCIA: 'arrow-left-right',
  PAGO_OTRO_MEDIO: 'credit-card',
  TRASLADO_BANCO: 'arrow-down-circle',
  SALIDA: 'log-out',
  AJUSTE: 'refresh-cw',
  DEVOLUCION: 'rotate-ccw',
  REVERSION: 'rotate-ccw',
};

export const SCHOOL_CASH_EXIT_LABEL: Record<SchoolCashExitDestination, string> = {
  ENTREGA_ADMINISTRACION: 'Entrega a administración',
  DEPOSITO_BANCARIO: 'Depósito bancario',
  GASTO_AUTORIZADO: 'Gasto autorizado',
  OTRO: 'Otro destino',
};

export const SCHOOL_CASH_EXIT_DESTINATIONS = Object.keys(SCHOOL_CASH_EXIT_LABEL) as SchoolCashExitDestination[];

export const SCHOOL_CASH_RECEIPT_STATUS_LABEL: Record<SchoolCashReceiptStatus, string> = {
  PENDIENTE: 'Pendiente de traslado',
  TRASLADO_PARCIAL: 'Traslado parcial',
  TRASLADADO: 'Trasladado',
  DEVUELTO: 'Devuelto al cliente',
  ANULADO: 'Anulado',
};

export interface SchoolCashMovement {
  id: string;
  sequence: number;
  movementNumber: string;
  movementType: SchoolCashMovementType;
  direction: SchoolCashDirection;
  amount: number;
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

export interface SchoolCashReceipt {
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

export interface SchoolCashTransfer {
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
  items: { receiptId: string; receiptNumber: string | null; quotationNumber: string | null; customerName: string | null; amount: number }[];
}

export interface SchoolCashExit {
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

export interface SchoolCashCount {
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
  details: { denomination: number; quantity: number; subtotal: number }[];
}

export type SchoolCashGranularity = 'day' | 'week' | 'month';

export interface SchoolCashSummary {
  /** Period of sales, collected money and transfers (null = whole season). */
  period: { from: string | null; to: string | null; granularity: SchoolCashGranularity };
  cashBalance: number;
  pendingTransfer: number;
  pendingReceipts: number;
  oldestPendingAt: string | null;
  transferredTotal: number;
  transfersCount: number;
  collected: {
    total: number;
    cash: number;
    transfer: number;
    deposit: number;
    other: number;
    refunds: number;
    advances: number;
    installments: number;
    beforeCashBox: number;
  };
  sales: { total: number; count: number };
  customersBalance: number;
  customersWithBalance: number;
  exitsTotal: number;
  adjustmentsNet: number;
  lastCount: SchoolCashCount | null;
  pendingByBank: { bankId: string; bankName: string; pending: number; receipts: number }[];
  series: { start: string; cash: number; bank: number; other: number; total: number }[];
  portfolio: {
    lists: number;
    paid: number;
    partial: number;
    pending: number;
    cancelled: number;
    paidAmount: number;
    partialBalance: number;
    pendingBalance: number;
  };
  customers: { total: number; withBalance: number; solvent: number; paying: number; notPaying: number };
  recent: SchoolCashMovement[];
}

// ── Customers (account statements) ───────────────────────────────────────

export type SchoolCustomerStatus = 'SOLVENTE' | 'ABONANDO' | 'PENDIENTE' | 'CANCELADO';
export type SchoolCustomerView = 'ALL' | 'WITH_BALANCE' | 'SOLVENT' | 'NO_PAYMENTS' | 'WITH_PAYMENTS';
export type SchoolCustomerSort = 'BALANCE' | 'PAID' | 'PURCHASED' | 'LAST_PAYMENT' | 'NAME';

export const SCHOOL_CUSTOMER_STATUS_LABEL: Record<SchoolCustomerStatus, string> = {
  SOLVENTE: 'Solvente',
  ABONANDO: 'Abonando',
  PENDIENTE: 'Pendiente',
  CANCELADO: 'Cancelado',
};

/** Pill tone (school-cash palette) of each customer state. */
export const SCHOOL_CUSTOMER_STATUS_TONE: Record<SchoolCustomerStatus, string> = {
  SOLVENTE: 'cash',
  ABONANDO: 'bank',
  PENDIENTE: 'owed',
  CANCELADO: 'neutral',
};

export const SCHOOL_LIST_ACCOUNT_LABEL: Record<string, string> = {
  PAGADA: 'Pagada',
  PARCIAL: 'Pago parcial',
  PENDIENTE: 'Sin pagos',
  CANCELADA: 'Cancelada',
  BORRADOR: 'Borrador (no cuenta)',
};

/** A customer of Listas Escolares: every list with the same phone digits. */
export interface SchoolCustomer {
  key: string;
  name: string;
  phone: string;
  otherNames: string[];
  students: string[];
  grades: string[];
  quotationNumbers: string[];
  lists: number;
  activeLists: number;
  purchased: number;
  paid: number;
  balance: number;
  status: SchoolCustomerStatus;
  lastPaymentAt: string | null;
  firstAt: string;
  nextDeliveryDate: string | null;
}

export interface SchoolCustomerPage extends SchoolCashPage<SchoolCustomer> {
  totals: { customers: number; purchased: number; paid: number; balance: number; byStatus: Record<SchoolCustomerStatus, number> };
}

export interface SchoolCustomerFilters {
  search?: string;
  view?: SchoolCustomerView;
  status?: SchoolCustomerStatus | '';
  grade?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: SchoolCustomerSort;
  page?: number;
  limit?: number;
}

export interface SchoolCustomerList {
  id: string;
  quotationNumber: string;
  studentName: string | null;
  grade: string;
  quotationDate: string;
  deliveryDate: string | null;
  status: string;
  statusLabel: string;
  accountStatus: string;
  total: number;
  paid: number;
  balance: number;
  itemCount: number;
  createdAt: string;
}

export interface SchoolCustomerPayment {
  id: string;
  quotationId: string;
  quotationNumber: string;
  studentName: string | null;
  receiptNumber: string;
  kind: string;
  typeLabel: string;
  amount: number;
  paymentMethod: string;
  methodLabel: string;
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
  destination: 'CAJA' | 'BANCO' | 'OTRO' | 'ANTERIOR' | null;
  transferStatus: SchoolCashReceiptStatus | null;
  pendingTransfer: number | null;
  /** Only in the all-payments list. */
  customerName?: string;
  customerPhone?: string;
}

export interface SchoolLedgerRow {
  at: string;
  kind: 'SALDO_INICIAL' | 'CARGO_LISTA' | 'MODIFICACION' | 'PAGO' | 'ANULACION_PAGO' | 'DEVOLUCION' | 'CANCELACION';
  description: string;
  quotationNumber: string | null;
  studentName: string | null;
  reference: string | null;
  charge: number;
  credit: number;
  balance: number;
}

export interface SchoolCustomerStatement {
  customer: SchoolCustomer & { percentPaid: number; statusLabel: string };
  lists: SchoolCustomerList[];
  payments: SchoolCustomerPayment[];
  ledger: {
    opening: number;
    rows: SchoolLedgerRow[];
    totalCharges: number;
    totalCredits: number;
    closing: number;
    officialBalance: number;
    consistent: boolean;
  };
}

export interface SchoolPaymentFilters {
  dateFrom?: string;
  dateTo?: string;
  method?: string;
  kind?: string;
  status?: 'APLICADO' | 'ANULADO' | '';
  bankId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SchoolPaymentPage extends SchoolCashPage<SchoolCustomerPayment> {
  totals: { received: number; refunds: number; voided: number };
}

/** Where a payment's money went, for people. */
export function paymentDestinationLabel(p: Pick<SchoolCustomerPayment, 'destination' | 'transferStatus' | 'kind'>): string {
  if (p.kind === 'ANULACION') {
    return 'Reversión';
  }
  switch (p.destination) {
    case 'CAJA':
      return 'Caja de Listas';
    case 'BANCO':
      return p.transferStatus ? `Banco · ${SCHOOL_CASH_RECEIPT_STATUS_LABEL[p.transferStatus] ?? p.transferStatus}` : 'Banco';
    case 'OTRO':
      return 'Otros medios';
    case 'ANTERIOR':
      return 'Anterior a la caja';
    default:
      return '—';
  }
}

export interface SchoolCashPage<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SchoolCashMovementFilters {
  dateFrom?: string;
  dateTo?: string;
  movementType?: SchoolCashMovementType | '';
  search?: string;
  bankId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface SchoolCashReportInfo {
  kind: string;
  title: string;
  description: string;
  usesRange: boolean;
}

export type SchoolCashReportValue = string | number | null;

export interface SchoolCashReport extends SchoolCashReportInfo {
  dateFrom: string;
  dateTo: string;
  periodLabel: string;
  cashBalance: number;
  columns: { key: string; label: string; type: 'text' | 'money' | 'int' | 'date' | 'datetime'; total: boolean }[];
  rows: Record<string, SchoolCashReportValue>[];
  totals: Record<string, number>;
}

/** Pending receipt older than this many days → alert on the dashboard. */
export const SCHOOL_CASH_PENDING_ALERT_DAYS = 3;

/** Whole days between an instant and now (for "pendiente hace N días"). */
export function daysSince(iso: string | null, now = Date.now()): number {
  if (!iso) {
    return 0;
  }
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? 0 : Math.max(0, Math.floor((now - time) / 86_400_000));
}

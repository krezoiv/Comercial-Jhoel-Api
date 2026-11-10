export const ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY = Symbol(
  'ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY',
);

/** How the client paid: physical cash (enters the cash Kardex) or a deposit into a registered bank account. */
export const SETTLEMENT_PAYMENT_METHODS = [
  'EFECTIVO',
  'DEPOSITO_BANCARIO',
] as const;
export type SettlementPaymentMethod =
  (typeof SETTLEMENT_PAYMENT_METHODS)[number];

export type SettlementStatus = 'APLICADO' | 'ANULADO';

/** Collection state of one CARGO, derived from its pending amount (never stored). */
export type ChargePaymentStatus = 'PENDIENTE' | 'PARCIAL' | 'CANCELADA';

/**
 * One CARGO with its pending amount, computed by `ar_charge_balances` in
 * PostgreSQL: amount − payments allocated to it − its FIFO share of the
 * client's general (unallocated) abonos.
 */
export interface ChargeBalance {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  description: string | null;
  originalAmount: number;
  /** Everything already collected on this account (allocated payments + general abonos). */
  paidAmount: number;
  pendingAmount: number;
  status: ChargePaymentStatus;
  createdAt: Date;
}

export interface SettlementItemData {
  accountReceivableId: string;
  /** Omitted = the full pending amount. Only a single-account operation may pay less. */
  amount?: number | null;
}

export interface SettleAccountsReceivableData {
  clientId: string;
  items: SettlementItemData[];
  paymentMethod: SettlementPaymentMethod;
  bankId: string | null;
  referenceNumber: string | null;
  observations: string | null;
  /** The total the user confirmed; the operation is rejected if PostgreSQL computes another one. */
  expectedTotal: number | null;
  userId: string;
  idempotencyKey: string;
}

export interface SettlementDetailRow {
  id: string;
  accountReceivableId: string;
  accountDate: string;
  accountDescription: string | null;
  accountOriginalAmount: number;
  amountPaid: number;
  previousBalance: number;
  newBalance: number;
}

export interface SettlementRow {
  id: string;
  clientId: string;
  clientName: string;
  paymentMethod: SettlementPaymentMethod;
  bankId: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  referenceNumber: string | null;
  totalAmount: number;
  accountsCount: number;
  status: SettlementStatus;
  observations: string | null;
  abonoId: string | null;
  cashMovementId: string | null;
  /** Cash Kardex balance right after this collection (cash payments only). */
  cashBalanceAfter: number | null;
  bankMovementId: string | null;
  /** Bank balance right after this collection (bank deposits only). */
  bankBalanceAfter: number | null;
  operationalDate: string | null;
  cutPeriodNumber: number | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface SettlementWithDetails extends SettlementRow {
  details: SettlementDetailRow[];
}

/** One payment applied to one account — the account's own payment history. */
export interface ChargePaymentRow {
  operationId: string;
  amountPaid: number;
  previousBalance: number;
  newBalance: number;
  paymentMethod: SettlementPaymentMethod;
  bankName: string | null;
  referenceNumber: string | null;
  status: SettlementStatus;
  accountsCount: number;
  createdByUsername: string;
  createdAt: Date;
  observations: string | null;
}

export interface FindSettlementsOptions {
  clientId?: string;
  status?: SettlementStatus;
  paymentMethod?: SettlementPaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface PaginatedSettlements {
  items: SettlementRow[];
  total: number;
  page: number;
  limit: number;
}

export interface SettlementBankInfo {
  id: string;
  name: string;
  accountNumber: string | null;
  isActive: boolean;
  specialAccount: string | null;
  balance: number;
}

/**
 * Persistence port of the "Cancelar cuenta(s) por cobrar" feature. Writes go
 * through the PostgreSQL functions `settle_accounts_receivable` /
 * `void_account_receivable_payment` (one transaction each); reads never
 * recompute a balance in TypeScript.
 */
export interface AccountReceivableSettlementRepository {
  /** Pending of every active CARGO of the given clients (one SQL call, any number of clients). */
  findChargeBalances(clientIds: string[]): Promise<ChargeBalance[]>;
  findChargeBalancesByIds(ids: string[]): Promise<ChargeBalance[]>;
  settle(data: SettleAccountsReceivableData): Promise<string>;
  void(operationId: string, userId: string, reason: string): Promise<void>;
  findById(id: string): Promise<SettlementWithDetails | null>;
  findAll(options: FindSettlementsOptions): Promise<PaginatedSettlements>;
  findChargePayments(chargeId: string): Promise<ChargePaymentRow[]>;
  getCashBalance(): Promise<number>;
  findBank(id: string): Promise<SettlementBankInfo | null>;
  findClientName(id: string): Promise<string | null>;
}

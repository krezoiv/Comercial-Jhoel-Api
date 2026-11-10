/** How the client paid an account: physical cash or a deposit into a registered bank account. */
export type SettlementPaymentMethod = 'EFECTIVO' | 'DEPOSITO_BANCARIO';
export type SettlementStatus = 'APLICADO' | 'ANULADO';
/** Collection state of one account (CARGO), computed by the backend. */
export type ChargePaymentStatus = 'PENDIENTE' | 'PARCIAL' | 'CANCELADA';

export const SETTLEMENT_METHOD_LABEL: Record<SettlementPaymentMethod, string> = {
  EFECTIVO: 'Efectivo',
  DEPOSITO_BANCARIO: 'Depósito bancario',
};

export const CHARGE_STATUS_LABEL: Record<ChargePaymentStatus, string> = {
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Parcial',
  CANCELADA: 'Cancelada',
};

/** One account with its pending amount — always from the backend (`ar_charge_balances`). */
export interface ChargeBalance {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  description: string | null;
  originalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: ChargePaymentStatus;
  createdAt: string;
}

export interface ClientPendingCharges {
  clientId: string;
  clientName: string;
  charges: ChargeBalance[];
  totalPending: number;
}

export interface SettlementItemInput {
  accountReceivableId: string;
  /** Omit = full pending. Only a single-account cancellation may send less. */
  amount?: number;
}

export interface SettlementPreviewInput {
  clientId: string;
  items: SettlementItemInput[];
  paymentMethod: SettlementPaymentMethod;
  bankId?: string;
}

export interface SettlementPreviewLine extends ChargeBalance {
  amountToPay: number;
  pendingAfter: number;
}

export interface SettlementPreview {
  clientId: string;
  clientName: string;
  paymentMethod: SettlementPaymentMethod;
  lines: SettlementPreviewLine[];
  total: number;
  cash: { current: number; after: number } | null;
  bank: { id: string; name: string; accountNumber: string | null; current: number; after: number } | null;
}

export interface SettleAccountsReceivableInput extends SettlementPreviewInput {
  referenceNumber?: string;
  observations?: string;
  /** The total the user confirmed; the backend rejects the operation if it computes another one. */
  expectedTotal: number;
  clientRequestId: string;
}

export interface SettlementDetail {
  id: string;
  accountReceivableId: string;
  accountDate: string;
  accountDescription: string | null;
  accountOriginalAmount: number;
  amountPaid: number;
  previousBalance: number;
  newBalance: number;
}

export interface Settlement {
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
  cashMovementId: string | null;
  cashBalanceAfter: number | null;
  bankMovementId: string | null;
  bankBalanceAfter: number | null;
  operationalDate: string | null;
  cutPeriodNumber: number | null;
  createdByUsername: string;
  createdAt: string;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface SettlementWithDetails extends Settlement {
  details: SettlementDetail[];
}

export interface SettlementResult {
  operation: SettlementWithDetails;
  /** Official cash balance after the operation. */
  cashBalance: number;
}

export interface ChargePayment {
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
  createdAt: string;
  observations: string | null;
}

export interface ChargePaymentHistory {
  charge: ChargeBalance | null;
  payments: ChargePayment[];
}

export interface SettlementFilters {
  clientId?: string;
  status?: SettlementStatus;
  paymentMethod?: SettlementPaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSettlements {
  items: Settlement[];
  total: number;
  page: number;
  limit: number;
}

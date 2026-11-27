import { ChargePaymentStatus } from './account-receivable-settlement.model';
import { KardexMovementType } from './kardex.model';
import { PortfolioPaymentMethod } from './portfolio-trace.model';

export interface AccountReceivable {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: KardexMovementType;
  description: string | null;
  /** EFECTIVO | BANCO; null = registered before the payment method existed (behaves as cash). */
  paymentMethod: PortfolioPaymentMethod | null;
  /** Origin of the row: 'BANK_DEPOSIT' (Transaccionar) or 'AR_PAYMENT' (Cartera collection). */
  referenceType?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdByUsername: string;
  updatedByUsername: string | null;
  /** List only, active CARGO rows: what is still owed / already collected / its state. `null` for ABONOs and inactive rows. */
  pendingAmount?: number | null;
  paidAmount?: number | null;
  paymentStatus?: ChargePaymentStatus | null;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps/clientName. */
export interface AccountReceivableInput {
  clientId: string;
  date: string;
  amount: number;
  description?: string;
  paymentMethod?: PortfolioPaymentMethod;
  /** Mandatory (≥5) when amount or payment method change: history + Caja reversal. */
  reason?: string;
}

export interface AccountReceivableFilters {
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  /** Omit for both states ("Todos"); true/false filters to exactly one. */
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedAccountsReceivable {
  items: AccountReceivable[];
  total: number;
  page: number;
  limit: number;
}

export { formatCurrency as formatAccountReceivableCurrency } from '../utils/number-format.util';

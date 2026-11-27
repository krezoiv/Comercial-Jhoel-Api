import {
  AccountReceivable,
  AccountReceivableMovementType,
} from '../entities/account-receivable.entity';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import type {
  PortfolioPaymentMethod,
  PortfolioRecordTrace,
  PortfolioStatement,
  PortfolioStatementMovement,
} from '../../../../shared/domain/portfolio-record';

export const ACCOUNT_RECEIVABLE_REPOSITORY = Symbol(
  'ACCOUNT_RECEIVABLE_REPOSITORY',
);

export type AccountReceivableSortField = 'date' | 'amount' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindAccountsReceivableOptions {
  /** undefined = both active and inactive; true/false = filtered to exactly one state. */
  isActive?: boolean;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy: AccountReceivableSortField;
  sortDirection: SortDirection;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FindAccountsReceivableReportSummaryOptions {
  isActive?: boolean;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AccountsReceivableReportSummary {
  recordCount: number;
  totalAmount: number;
}

export interface CreateAccountReceivableData {
  clientId: string;
  date: string;
  amount: number;
  description: string | null;
  paymentMethod: PortfolioPaymentMethod;
  createdBy: string;
}

export interface UpdateAccountReceivableData {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
  paymentMethod?: PortfolioPaymentMethod;
  /** Mandatory (≥5) when amount or payment method change — enforced by the database. */
  reason?: string | null;
  updatedBy: string;
}

/** One Kardex movement, backing the "Registrar Cargo"/"Registrar Abono" flow — invokes `register_account_receivable_movement`. */
export interface RegisterAccountReceivableMovementData {
  clientId: string;
  movementType: AccountReceivableMovementType;
  amount: number;
  date: string;
  description: string | null;
  createdBy: string;
  /** Polymorphic origin tag — `null`/omitted for a movement registered directly through Cuentas por Cobrar (every existing caller). Set together (e.g. `'BANK_DEPOSIT'` + a `bank_deposit_operations.id`) when a movement was generated as a side effect of another module's write — see Transaccionar's "Enviar a cuentas por cobrar". */
  referenceType?: string | null;
  referenceId?: string | null;
  /** null/undefined = EFECTIVO. */
  paymentMethod?: PortfolioPaymentMethod | null;
}

/** A statement row: voided rows included (balanceAfter null), each with its cash trace. */
export type StatementMovement = PortfolioStatementMovement;

export interface GetAccountReceivableStatementOptions {
  dateFrom?: string;
  dateTo?: string;
  includeVoided?: boolean;
}

export type AccountReceivableStatement = PortfolioStatement;

export interface AccountReceivableRepository {
  findAll(
    options: FindAccountsReceivableOptions,
  ): Promise<PaginatedResult<AccountReceivable>>;
  getReportSummary(
    options: FindAccountsReceivableReportSummaryOptions,
  ): Promise<AccountsReceivableReportSummary>;
  findById(
    id: string,
    context?: TransactionContext,
  ): Promise<AccountReceivable | null>;
  create(data: CreateAccountReceivableData): Promise<AccountReceivable>;
  update(
    id: string,
    data: UpdateAccountReceivableData,
  ): Promise<AccountReceivable>;
  /** Voids with a reason (≥5): reverses its Caja effect, keeps the row and its history. */
  deactivate(id: string, reason: string, userId: string): Promise<void>;
  /** Invokes the `register_account_receivable_movement` Postgres function — validation (including the `ABONO_EXCEEDS_BALANCE` rejection, unlike Activos), balance computation, and the insert all happen atomically, serialized per client via an advisory lock. `context`, when provided, is used instead of this repository's own connection — lets a caller (e.g. Transaccionar's deposit registration) wrap this call and another module's write in one shared DB transaction. Omitted by every caller that doesn't need that. */
  registerMovement(
    data: RegisterAccountReceivableMovementData,
    context?: TransactionContext,
  ): Promise<AccountReceivable>;
  /** The client's current signed balance — a single bounded aggregate, never a full-history fetch. */
  getCurrentBalance(clientId: string): Promise<number>;
  /** Payment method, Kardex movements and change history of one record (null when it does not exist). */
  getTrace(id: string): Promise<PortfolioRecordTrace | null>;
  getStatement(
    clientId: string,
    options: GetAccountReceivableStatementOptions,
  ): Promise<AccountReceivableStatement>;
}

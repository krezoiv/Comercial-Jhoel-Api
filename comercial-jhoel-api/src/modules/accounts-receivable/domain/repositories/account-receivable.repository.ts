import {
  AccountReceivable,
  AccountReceivableMovementType,
} from '../entities/account-receivable.entity';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';

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
  createdBy: string;
}

export interface UpdateAccountReceivableData {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
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
}

export interface StatementMovement {
  id: string;
  date: string;
  movementType: AccountReceivableMovementType;
  description: string | null;
  amount: number;
  /** The running balance immediately after this movement — computed fresh on every read, never stored (see the migration's own doc comment for why). */
  balanceAfter: number;
  createdByUsername: string;
  createdAt: Date;
}

export interface GetAccountReceivableStatementOptions {
  /** Omit for "since the beginning" — `openingBalance` is then always 0. */
  dateFrom?: string;
  dateTo?: string;
}

export interface AccountReceivableStatement {
  clientId: string;
  clientName: string;
  /** The signed running balance immediately before `dateFrom` — 0 if `dateFrom` is omitted, never assumed zero when real prior activity exists. */
  openingBalance: number;
  movements: StatementMovement[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
}

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
  deactivate(id: string): Promise<void>;
  /** Invokes the `register_account_receivable_movement` Postgres function — validation (including the `ABONO_EXCEEDS_BALANCE` rejection, unlike Activos), balance computation, and the insert all happen atomically, serialized per client via an advisory lock. `context`, when provided, is used instead of this repository's own connection — lets a caller (e.g. Transaccionar's deposit registration) wrap this call and another module's write in one shared DB transaction. Omitted by every caller that doesn't need that. */
  registerMovement(
    data: RegisterAccountReceivableMovementData,
    context?: TransactionContext,
  ): Promise<AccountReceivable>;
  /** The client's current signed balance — a single bounded aggregate, never a full-history fetch. */
  getCurrentBalance(clientId: string): Promise<number>;
  getStatement(
    clientId: string,
    options: GetAccountReceivableStatementOptions,
  ): Promise<AccountReceivableStatement>;
}

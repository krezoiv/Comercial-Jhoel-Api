import { BankDepositOperation } from '../entities/bank-deposit-operation.entity';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';

export const BANK_DEPOSIT_REPOSITORY = Symbol('BANK_DEPOSIT_REPOSITORY');

export interface BankDepositCashDetailData {
  denomination: number;
  quantity: number;
}

export interface RegisterBankDepositOperationData {
  transactionBankId: string;
  totalAmount: number;
  operationDate: string;
  cashDetails: BankDepositCashDetailData[];
  transactionAmounts: number[];
  userId: string;
  /** Free-text — never looked up against the `clients` table, see the entity's own doc comment. */
  clientName: string | null;
  /** A REGISTERED client, validated (exists + active) before this is ever called — `null`/omitted for every transaction type/deposit not linked to one. Independent of `clientName`: both are set together when a registered client is picked (the resolved client's name is what's persisted as `clientName` for display — see `RegisterBankDepositOperationUseCase`). */
  clientId?: string | null;
  transactionTypeId: string;
  /** "Vuelto" — omitted/`0` means no vuelto, byte-identical to this operation's behavior before vuelto existed. The SQL function recomputes/validates this server-side regardless of what's sent. */
  changeGiven?: number;
}

export interface FindBankDepositOperationsOptions {
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface BankDepositReportFilters {
  startDate?: string;
  endDate?: string;
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
}

export interface BankDepositReportByBank {
  transactionBankId: string;
  transactionBankName: string;
  operationCount: number;
  /** `SUM(transaction_count)` for this bank — the "cantidad de transacciones" total, distinct from `operationCount` (number of Transaccionar registrations). See `GetDashboardSummaryUseCase`'s own doc comment for why these two are never the same number. */
  transactionCount: number;
  totalAmount: number;
}

export interface BankDepositReportSummary {
  operationCount: number;
  transactionCount: number;
  totalAmount: number;
  byBank: BankDepositReportByBank[];
}

export interface BankDepositDailyTransactionCount {
  /** `yyyy-MM-dd` — only dates with at least one non-voided operation are returned; the caller zero-fills the rest of the month. */
  date: string;
  transactionCount: number;
}

export interface BankDepositRepository {
  /** Invokes the `register_bank_deposit_operation` Postgres function — the operation, its cash details, and its transactions all commit (or none do) atomically inside it. `context`, when provided (a `TransactionContext` from `TransactionManager.runInTransaction`), is used instead of this repository's own connection — so a caller can wrap this call and another module's write (e.g. an accounts-receivable CARGO) in one shared DB transaction. Omitted by every caller that doesn't need that. */
  registerOperation(
    data: RegisterBankDepositOperationData,
    context?: TransactionContext,
  ): Promise<BankDepositOperation>;
  /** Never restricted by ownership, unlike Sales/Purchases — a shared operational record, same access policy as Bancos/Recargas. */
  findAll(
    options: FindBankDepositOperationsOptions,
  ): Promise<PaginatedResult<BankDepositOperation>>;
  findById(
    id: string,
    context?: TransactionContext,
  ): Promise<BankDepositOperation | null>;
  /** Excludes voided operations — a report is about real deposited money, see `TypeOrmBankDepositRepository.getReportSummary`'s own doc comment. */
  getReportSummary(
    filters: BankDepositReportFilters,
  ): Promise<BankDepositReportSummary>;
  /** `SUM(transaction_count)` grouped by `operation_date`, `is_voided = false` — one row per date that had at least one non-voided operation. Backs the "Transacciones del mes" chart on Resumen/Reporte de Transacciones; the caller zero-fills any date in range with no row. */
  getDailyTransactionCounts(
    startDate: string,
    endDate: string,
  ): Promise<BankDepositDailyTransactionCount[]>;
  /** Marks the operation voided — never a physical DELETE, never rewrites `totalAmount`/cash/transactions. The caller (`VoidBankDepositOperationUseCase`) has already checked the operation exists and isn't already voided. */
  voidOperation(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<BankDepositOperation>;
}

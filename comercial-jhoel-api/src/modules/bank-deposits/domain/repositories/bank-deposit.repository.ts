import { BankDepositOperation } from '../entities/bank-deposit-operation.entity';

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
  transactionTypeId: string;
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

export interface BankDepositRepository {
  /** Invokes the `register_bank_deposit_operation` Postgres function — the operation, its cash details, and its transactions all commit (or none do) atomically inside it. */
  registerOperation(
    data: RegisterBankDepositOperationData,
  ): Promise<BankDepositOperation>;
  /** Never restricted by ownership, unlike Sales/Purchases — a shared operational record, same access policy as Bancos/Recargas. */
  findAll(
    options: FindBankDepositOperationsOptions,
  ): Promise<PaginatedResult<BankDepositOperation>>;
  findById(id: string): Promise<BankDepositOperation | null>;
  /** Excludes voided operations — a report is about real deposited money, see `TypeOrmBankDepositRepository.getReportSummary`'s own doc comment. */
  getReportSummary(
    filters: BankDepositReportFilters,
  ): Promise<BankDepositReportSummary>;
  /** Marks the operation voided — never a physical DELETE, never rewrites `totalAmount`/cash/transactions. The caller (`VoidBankDepositOperationUseCase`) has already checked the operation exists and isn't already voided. */
  voidOperation(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<BankDepositOperation>;
}

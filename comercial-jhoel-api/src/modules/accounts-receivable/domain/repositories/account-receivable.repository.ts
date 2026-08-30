import { AccountReceivable } from '../entities/account-receivable.entity';

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

export interface AccountReceivableRepository {
  findAll(
    options: FindAccountsReceivableOptions,
  ): Promise<PaginatedResult<AccountReceivable>>;
  getReportSummary(
    options: FindAccountsReceivableReportSummaryOptions,
  ): Promise<AccountsReceivableReportSummary>;
  findById(id: string): Promise<AccountReceivable | null>;
  create(data: CreateAccountReceivableData): Promise<AccountReceivable>;
  update(
    id: string,
    data: UpdateAccountReceivableData,
  ): Promise<AccountReceivable>;
  deactivate(id: string): Promise<void>;
}

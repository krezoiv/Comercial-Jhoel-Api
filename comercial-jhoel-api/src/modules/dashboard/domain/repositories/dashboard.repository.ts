export const DASHBOARD_REPOSITORY = Symbol('DASHBOARD_REPOSITORY');

export interface DailyAmountRow {
  date: string;
  amount: number;
}

export interface BankTransactionRow {
  bankId: string;
  bankName: string;
  transactions: number;
}

export interface DashboardPeriodRange {
  /** Plain `yyyy-MM-dd`, first day of the current month — used against the plain `DATE` columns (`recharge_daily_balances.date`, `bank_deposit_operations.operation_date`), lexicographic string comparison is already correct for those. */
  isoStartDate: string;
  /** Plain `yyyy-MM-dd`, today. */
  isoEndDate: string;
  /** Local midnight of the 1st of the current month, as an absolute instant — used against `timestamptz` columns (`sales.sale_date`, `purchases.purchase_date`). */
  dayStart: Date;
  /** Local 23:59:59.999 of today, as an absolute instant. */
  dayEnd: Date;
}

export interface DashboardRawSummary {
  /** One row per calendar day that had at least one closed recharge cycle (`finalBalance IS NOT NULL`) in the period — days with no closed cycle are simply absent, never a `0`-amount row. */
  rechargeSalesByDay: DailyAmountRow[];
  /** One row per calendar day that had at least one `CONFIRMED` sale in the period. */
  salesByDay: DailyAmountRow[];
  purchasesTotal: number;
  /** One row per bank that had at least one non-anulada Transaccionar operation in the period — a bank with zero activity that month is simply absent. */
  bankTransactionsByBank: BankTransactionRow[];
}

export interface DashboardRepository {
  /**
   * Runs the four underlying aggregate queries (recharge sales by day,
   * general sales by day, purchases total, Transaccionar transactions by
   * bank) for the given period in one call — mirrors
   * `TypeOrmBankDepositRepository.getReportSummary()`'s own "one method,
   * several small internal queries" shape. Every query is already scoped to
   * the period range at the SQL level (never fetches a full history to
   * filter in Node) and every result set is naturally bounded (at most one
   * row per calendar day, or one row per bank — never per-transaction).
   */
  getSummary(period: DashboardPeriodRange): Promise<DashboardRawSummary>;
}

import { RechargeDailyBalance } from '../entities/recharge-daily-balance.entity';

export const RECHARGE_DAILY_BALANCE_REPOSITORY = Symbol(
  'RECHARGE_DAILY_BALANCE_REPOSITORY',
);

export interface RegisterRechargePurchaseData {
  rechargeTypeId: string;
  date: string;
  amount: number;
  userId: string;
}

export interface RegisterRechargeFinalBalanceData {
  dailyBalanceId: string;
  finalBalance: number;
  userId: string;
}

export interface FindRechargeHistoryOptions {
  startDate?: string;
  endDate?: string;
  rechargeTypeId?: string;
  userId?: string;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FindRechargeReportSummaryOptions {
  startDate?: string;
  endDate?: string;
  rechargeTypeId?: string;
}

export interface RechargeReportSummary {
  recordCount: number;
  closedCount: number;
  totalPurchases: number;
  /** Sum of `sale` across CLOSED rows only — an open (unclosed) row contributes nothing, matching `RechargeDailyBalance.sale`'s own "never a premature 0" rule. */
  totalSales: number;
}

export interface RechargeDailyBalanceRepository {
  /** Invokes `ensure_recharge_daily_balance` — finds this date's CURRENT cycle row for this type, or lazily creates it with `previousBalance` copied from the most recent closed cycle. */
  ensureDailyBalance(
    rechargeTypeId: string,
    date: string,
    userId: string,
  ): Promise<RechargeDailyBalance>;
  /** The CURRENT (highest-`sequence`) cycle row for this (type, date), if any. */
  findByTypeAndDate(
    rechargeTypeId: string,
    date: string,
  ): Promise<RechargeDailyBalance | null>;
  /** Every recharge type's CURRENT cycle row for one date — used to compute the sales summary/closure across all operators at once. */
  findAllByDate(date: string): Promise<RechargeDailyBalance[]>;
  findById(id: string): Promise<RechargeDailyBalance | null>;
  /** Invokes `register_recharge_purchase` — validates the type, records the movement, and increments the day's running total, atomically. */
  registerPurchase(
    data: RegisterRechargePurchaseData,
  ): Promise<RechargeDailyBalance>;
  /** Invokes `register_recharge_final_balance` — validates and writes the day's close-out figure. */
  registerFinalBalance(
    data: RegisterRechargeFinalBalanceData,
  ): Promise<RechargeDailyBalance>;
  findHistory(
    options: FindRechargeHistoryOptions,
  ): Promise<PaginatedResult<RechargeDailyBalance>>;
  /** Aggregate totals across every cycle matching the filters — backs the Reportería summary tiles/PDF, never scoped to only the current cycle the way the daily-summary card is. */
  getReportSummary(
    options: FindRechargeReportSummaryOptions,
  ): Promise<RechargeReportSummary>;
}

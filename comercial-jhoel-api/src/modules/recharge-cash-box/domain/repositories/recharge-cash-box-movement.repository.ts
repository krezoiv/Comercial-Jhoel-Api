import {
  CashBoxMovementType,
  RechargeCashBoxMovement,
} from '../entities/recharge-cash-box-movement.entity';

export const RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY = Symbol(
  'RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY',
);

export interface RegisterCashBoxMovementData {
  amount: number;
  movementType: CashBoxMovementType;
  businessDate: string;
  concept: string;
  userId: string;
}

/** One category's raw sum for a single `yyyy-MM-dd` day — `0` when nothing happened that day, never `null`. */
export interface CashBoxDailyTotals {
  salesRecharges: number;
  salesSim: number;
  purchasesRecharges: number;
  purchasesSim: number;
  contributions: number;
  withdrawals: number;
}

export type CashBoxHistoryMovementType =
  | 'RECHARGE_SALE'
  | 'SIM_SALE'
  | 'RECHARGE_PURCHASE'
  | 'SIM_PURCHASE'
  | 'CONTRIBUTION'
  | 'PROFIT_WITHDRAWAL';

export interface CashBoxMovementRow {
  date: string;
  type: CashBoxHistoryMovementType;
  concept: string;
  income: number;
  expense: number;
  /** Running accumulated balance through this movement, computed over the FULL unfiltered history — always the true Caja balance at that point, regardless of which filters narrowed the visible list. */
  balance: number;
  /** Only populated for `CONTRIBUTION`/`PROFIT_WITHDRAWAL` rows (a specific person's specific action) — auto-sourced rows aggregate a whole day/category, so no single user applies. */
  username: string | null;
  /** Only populated for `CONTRIBUTION`/`PROFIT_WITHDRAWAL` rows — lets the frontend resolve the exact movement for a "Ver"/void action. */
  movementId: string | null;
}

export interface FindCashBoxMovementsOptions {
  startDate?: string;
  endDate?: string;
  type?: CashBoxHistoryMovementType;
  page: number;
  limit: number;
}

export interface PaginatedCashBoxMovements {
  items: CashBoxMovementRow[];
  total: number;
  page: number;
  limit: number;
}

export interface RechargeCashBoxMovementRepository {
  /** Invokes `register_recharge_cash_box_movement` — validates and inserts atomically, serialized against concurrent movements via an advisory lock. The balance-exceeded check only applies when `movementType === 'WITHDRAWAL'`. */
  registerMovement(
    data: RegisterCashBoxMovementData,
  ): Promise<RechargeCashBoxMovement>;
  /** Plain conditional `UPDATE` — no stored function needed, same "don't build a procedure where a plain statement is already correct" call as `TypeOrmBankDepositRepository.voidOperation`. Works for either movement type. */
  voidMovement(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargeCashBoxMovement>;
  findById(id: string): Promise<RechargeCashBoxMovement | null>;
  /** Sums each of the live source tables (never a copy) for exactly one calendar day — `beforeDate`, `onDate`, whatever the caller needs; see `GetCashBoxBalanceUseCase` for how "saldo anterior"/"saldo actual" are derived from two calls to this. */
  getDailyTotals(options: {
    beforeDate?: string;
    onDate?: string;
  }): Promise<CashBoxDailyTotals>;
  findMovements(
    options: FindCashBoxMovementsOptions,
  ): Promise<PaginatedCashBoxMovements>;
}

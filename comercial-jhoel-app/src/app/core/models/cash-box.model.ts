/**
 * "Caja Contable" — an accumulated cash balance for Recargas Electrónicas y
 * SIMs. Ingresos/salidas from ventas/compras are never entered manually —
 * they're always derived live on the backend from the real sale/purchase
 * rows that already exist; the only two things an admin ever registers
 * directly here are a manual "Aporte a Caja" (income) or "Salida de
 * Ganancia" (expense) movement.
 */
export interface CashBoxBalance {
  date: string;
  previousBalance: number;
  incomeToday: number;
  expenseToday: number;
  currentBalance: number;
  detail: {
    salesRecharges: number;
    salesSim: number;
    contributions: number;
    purchasesRecharges: number;
    purchasesSim: number;
    profitWithdrawals: number;
  };
}

export type CashBoxMovementType =
  | 'RECHARGE_SALE'
  | 'SIM_SALE'
  | 'RECHARGE_PURCHASE'
  | 'SIM_PURCHASE'
  | 'CONTRIBUTION'
  | 'PROFIT_WITHDRAWAL';

export const CASH_BOX_MOVEMENT_TYPE_LABEL: Record<CashBoxMovementType, string> = {
  RECHARGE_SALE: 'Ventas de Recargas',
  SIM_SALE: 'Ventas de SIM',
  RECHARGE_PURCHASE: 'Compra de Recargas',
  SIM_PURCHASE: 'Compra de SIM',
  CONTRIBUTION: 'Aporte a Caja',
  PROFIT_WITHDRAWAL: 'Salida de Ganancia',
};

export interface CashBoxMovement {
  date: string;
  type: CashBoxMovementType;
  concept: string;
  income: number;
  expense: number;
  /** Running accumulated Caja balance through this movement — always the true global balance at that point, regardless of which filters narrowed the visible list. */
  balance: number;
  /** Only populated for `CONTRIBUTION`/`PROFIT_WITHDRAWAL` rows — auto-sourced rows aggregate a whole day/category, so no single user applies. */
  username: string | null;
  /** Only populated for `CONTRIBUTION`/`PROFIT_WITHDRAWAL` rows — the id to target for a "Ver"/anular action. */
  movementId: string | null;
}

export interface PaginatedCashBoxMovements {
  items: CashBoxMovement[];
  total: number;
  page: number;
  limit: number;
}

export interface CashBoxMovementsFilters {
  startDate?: string;
  endDate?: string;
  type?: CashBoxMovementType;
  page?: number;
  limit?: number;
}

/** A single registered manual movement (aporte or salida) — `movementType` tells them apart. */
export interface CashBoxMovementRecord {
  id: string;
  amount: number;
  movementType: 'CONTRIBUTION' | 'WITHDRAWAL';
  businessDate: string;
  concept: string;
  createdByUsername: string;
  createdAt: string;
  isVoided: boolean;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface RegisterCashBoxWithdrawalInput {
  amount: number;
  concept: string;
  businessDate?: string;
}

export interface RegisterCashBoxContributionInput {
  amount: number;
  concept: string;
  businessDate?: string;
}

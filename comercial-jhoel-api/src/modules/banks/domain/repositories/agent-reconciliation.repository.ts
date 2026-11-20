import { AgentReconciliation } from '../entities/agent-reconciliation.entity';

export const AGENT_RECONCILIATION_REPOSITORY = Symbol(
  'AGENT_RECONCILIATION_REPOSITORY',
);

/** MANUAL = typed by hand; ARQUEO_CAJA = a standalone Arqueo de Caja; CORTE_CAJA = the arqueo of one cut. */
export const CUADRE_CASH_BREAKDOWN_SOURCES = [
  'MANUAL',
  'ARQUEO_CAJA',
  'CORTE_CAJA',
] as const;
export type CuadreCashBreakdownSource =
  (typeof CUADRE_CASH_BREAKDOWN_SOURCES)[number];

/**
 * The cash breakdown a cuadre is saved with — stored as an independent
 * photograph (`agent_reconciliation_cash_breakdowns`/`_details`). With
 * ARQUEO_CAJA / CORTE_CAJA the SQL function snapshots the source record
 * (cut, date, user, total) and derives by itself whether the loaded
 * quantities were modified.
 */
export interface CuadreCashBreakdownData {
  source: CuadreCashBreakdownSource;
  /** `cash_counts.id` (ARQUEO_CAJA) or `cash_cut_counts.id` (CORTE_CAJA); null for MANUAL. */
  sourceCashCountId: string | null;
  details: CuadreDenominationRow[];
}

/** One denomination row of a count (whole quantity ≥ 0). */
export interface CuadreDenominationRow {
  denomination: number;
  quantity: number;
}

/**
 * The cuadre's "Arqueo de Caja" as saved (`agent_reconciliation_cash_breakdowns`
 * + caja and Bodega details). The custody fields (theoretical balances,
 * Bodega count, differences) are null on cuadres saved before Bodega was
 * counted (migration 1760008800000): those only have the caja breakdown.
 */
export interface CuadreCashCountSnapshot {
  reconciliationId: string;
  source: CuadreCashBreakdownSource;
  sourceCountNumber: number | null;
  sourceCutNumber: number | null;
  sourceCountedAt: Date | null;
  sourceBusinessDate: string | null;
  modifiedAfterLoad: boolean;
  /** Physical caja count. */
  cashCounted: number;
  cashTheoretical: number | null;
  cashDifference: number | null;
  warehouseTheoretical: number | null;
  warehouseCounted: number | null;
  warehouseDifference: number | null;
  /** cashTheoretical + warehouseTheoretical. */
  theoreticalTotal: number | null;
  /** cashCounted + warehouseCounted. */
  countedTotal: number | null;
  consolidatedDifference: number | null;
  observations: string | null;
  createdByUsername: string;
  createdAt: Date;
  cashDetails: Array<CuadreDenominationRow & { subtotal: number }>;
  warehouseDetails: Array<CuadreDenominationRow & { subtotal: number }>;
}

export interface CloseAgentDayData {
  date: string;
  totalCash: number;
  /** Bodega cash at close time (consolidated cuadre); 0 on every historical row. */
  totalWarehouseCash: number;
  /** School-list money in banks subtracted from the result (0 on historical rows). */
  totalSchoolListPending: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  userId: string;
  /** Optional for backwards compatibility: callers that send only `totalCash` keep the original path. */
  cashBreakdown?: CuadreCashBreakdownData | null;
  /**
   * Physical Bodega count of the "Arqueo de Caja" (independent from the caja
   * one). Its total is `totalWarehouseCash`. Only with `cashBreakdown`.
   */
  warehouseDetails?: CuadreDenominationRow[] | null;
  observations?: string | null;
}

export interface AgentReconciliationRepository {
  /**
   * "Guardar Cuadre" + "Cerrar Día" as a single atomic operation (see
   * `close_agent_day` in migration `AddDayClosingToDayOpenings`): either
   * both writes (the new reconciliation, the closed day) commit together,
   * or neither does — a saved reconciliation can never be left with the
   * day still open, or vice versa.
   */
  closeDayWithReconciliation(
    data: CloseAgentDayData,
  ): Promise<AgentReconciliation>;
  /** Does a saved reconciliation already exist for this date? — used by `GetDayStatusUseCase`, informational only (see also `DayOpening.isClosed` for the real block). */
  existsForDate(date: string): Promise<boolean>;
  /** The CURRENT reconciliation for a date — there can be more than one historical row if the day was reopened and closed again; this is always the most recent one. Used by "Gestión de Días Cerrados" for the detail view. */
  findLatestByDate(date: string): Promise<AgentReconciliation | null>;
  /** The "Arqueo de Caja" saved with a reconciliation, or null when it was saved with no breakdown. */
  findCashCount(
    reconciliationId: string,
  ): Promise<CuadreCashCountSnapshot | null>;
}

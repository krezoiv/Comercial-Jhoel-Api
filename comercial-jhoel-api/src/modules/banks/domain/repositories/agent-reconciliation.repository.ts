import { AgentReconciliation } from '../entities/agent-reconciliation.entity';

export const AGENT_RECONCILIATION_REPOSITORY = Symbol(
  'AGENT_RECONCILIATION_REPOSITORY',
);

export const CUADRE_CASH_BREAKDOWN_SOURCES = ['MANUAL', 'ARQUEO_CAJA'] as const;
export type CuadreCashBreakdownSource =
  (typeof CUADRE_CASH_BREAKDOWN_SOURCES)[number];

/**
 * The cash breakdown a cuadre is saved with — stored as an independent
 * photograph (`agent_reconciliation_cash_breakdowns`/`_details`). With
 * ARQUEO_CAJA the SQL function snapshots the source count (date, user, total)
 * and derives by itself whether the loaded quantities were modified.
 */
export interface CuadreCashBreakdownData {
  source: CuadreCashBreakdownSource;
  sourceCashCountId: string | null;
  details: Array<{ denomination: number; quantity: number }>;
}

export interface CloseAgentDayData {
  date: string;
  totalCash: number;
  /** Bodega cash at close time (consolidated cuadre); 0 on every historical row. */
  totalWarehouseCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  userId: string;
  /** Optional for backwards compatibility: callers that send only `totalCash` keep the original path. */
  cashBreakdown?: CuadreCashBreakdownData | null;
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
}

import { AgentReconciliation } from '../entities/agent-reconciliation.entity';

export const AGENT_RECONCILIATION_REPOSITORY = Symbol(
  'AGENT_RECONCILIATION_REPOSITORY',
);

export interface CloseAgentDayData {
  date: string;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  userId: string;
}

export interface AgentReconciliationRepository {
  /**
   * "Guardar Cuadre" + "Cerrar Día" as a single atomic operation (see
   * `close_agent_day` in migration `AddDayClosingToDayOpenings`): either
   * both writes (the new reconciliation, the closed day) commit together,
   * or neither does — a saved reconciliation can never be left with the
   * day still open, or vice versa.
   */
  closeDayWithReconciliation(data: CloseAgentDayData): Promise<AgentReconciliation>;
  /** Does a saved reconciliation already exist for this date? — used by `GetDayStatusUseCase`, informational only (see also `DayOpening.isClosed` for the real block). */
  existsForDate(date: string): Promise<boolean>;
  /** The CURRENT reconciliation for a date — there can be more than one historical row if the day was reopened and closed again; this is always the most recent one. Used by "Gestión de Días Cerrados" for the detail view. */
  findLatestByDate(date: string): Promise<AgentReconciliation | null>;
}

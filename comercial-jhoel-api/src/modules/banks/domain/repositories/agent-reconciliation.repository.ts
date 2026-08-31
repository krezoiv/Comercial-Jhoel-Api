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
   * "Guardar Cuadre" + "Cerrar Día" como una sola operación atómica (ver
   * `close_agent_day` en la migración `AddDayClosingToDayOpenings`): o
   * ambas escrituras (el cuadre nuevo, el día cerrado) se confirman
   * juntas, o ninguna lo hace — nunca puede quedar un cuadre guardado sin
   * cerrar el día, ni viceversa.
   */
  closeDayWithReconciliation(data: CloseAgentDayData): Promise<AgentReconciliation>;
  /** ¿Ya existe un cuadre guardado para esta fecha? — usado por `GetDayStatusUseCase`, informativo (ver también `DayOpening.isClosed` para el bloqueo real). */
  existsForDate(date: string): Promise<boolean>;
  /** El cuadre VIGENTE de una fecha — puede haber más de uno histórico si el día fue reabierto y vuelto a cerrar; este es siempre el más reciente. Usado por "Gestión de Días Cerrados" para el detalle. */
  findLatestByDate(date: string): Promise<AgentReconciliation | null>;
}

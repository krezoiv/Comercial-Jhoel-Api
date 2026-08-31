import { ClosedDayStatus } from '../../domain/repositories/day-opening.repository';
import { BankBalanceView } from '../../domain/entities/bank-balance-view.entity';
import { AgentReconciliationOutput } from './agent-reconciliation-output';
import { DayAuditAction } from '../../domain/entities/day-audit-log.entity';

export interface DayAuditLogOutput {
  id: string;
  action: DayAuditAction;
  performedByUsername: string;
  performedAt: Date;
  reason: string | null;
  previousStatus: string | null;
  newStatus: string | null;
}

/**
 * "Ver Detalle" de un día cerrado — compone lecturas que ya existen en
 * otros use cases (`BankBalanceRepository.findBalancesView`,
 * `AgentReconciliationRepository.findLatestByDate`), nunca las duplica.
 *
 * NO incluye un desglose de denominaciones de efectivo: esta app nunca
 * tuvo una tabla de conteo de efectivo — `agent_reconciliations.total_cash`
 * es y siempre fue el único valor de efectivo que el backend conoce (ver
 * `CloseAgentDayUseCase`, "el conteo de efectivo no tiene fuente de verdad
 * en el servidor"). Inventar un desglose por denominación aquí sería
 * mostrar datos que la base de datos nunca tuvo.
 */
export interface DayDetailOutput {
  date: string;
  status: ClosedDayStatus;
  openedAt: Date;
  openedByUsername: string;
  closedAt: Date | null;
  closedByUsername: string | null;
  reopenedAt: Date | null;
  reopenedByUsername: string | null;
  reopenReason: string | null;
  isCancelled: boolean;
  cancelledAt: Date | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  banks: BankBalanceView[];
  reconciliation: AgentReconciliationOutput | null;
  auditLog: DayAuditLogOutput[];
}

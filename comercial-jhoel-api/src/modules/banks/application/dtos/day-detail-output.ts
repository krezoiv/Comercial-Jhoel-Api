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
 * "Ver Detalle" of a closed day — composes reads that already exist in
 * other use cases (`BankBalanceRepository.findBalancesView`,
 * `AgentReconciliationRepository.findLatestByDate`), never duplicates
 * them.
 *
 * Does NOT include a cash-denomination breakdown: this app never had a
 * cash-count table — `agent_reconciliations.total_cash` is and always was
 * the only cash figure the backend knows (see `CloseAgentDayUseCase`,
 * "the cash count has no source of truth on the server"). Inventing a
 * per-denomination breakdown here would be showing data the database
 * never had.
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

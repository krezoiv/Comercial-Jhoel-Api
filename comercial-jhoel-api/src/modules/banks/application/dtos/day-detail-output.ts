import type { CuadreCashCountSnapshot } from '../../domain/repositories/agent-reconciliation.repository';
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
 * `cashCount` is the "Arqueo de Caja" saved with the current
 * reconciliation (caja and, since migration 1760008800000, Bodega counts with
 * their theoretical balances and differences). Null when the cuadre was saved
 * without a breakdown (before migration 1760007600000): nothing is invented.
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
  cashCount: CuadreCashCountSnapshot | null;
  auditLog: DayAuditLogOutput[];
}

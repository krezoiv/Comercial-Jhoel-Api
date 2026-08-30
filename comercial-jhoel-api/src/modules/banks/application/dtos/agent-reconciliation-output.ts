import { AgentReconciliation } from '../../domain/entities/agent-reconciliation.entity';

export interface AgentReconciliationOutput {
  id: string;
  date: string;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdAt: Date;
  createdByUsername: string;
}

export function toAgentReconciliationOutput(
  reconciliation: AgentReconciliation,
): AgentReconciliationOutput {
  return {
    id: reconciliation.id,
    date: reconciliation.date,
    totalCash: reconciliation.totalCash,
    totalBanks: reconciliation.totalBanks,
    totalAssets: reconciliation.totalAssets,
    totalAccountsReceivable: reconciliation.totalAccountsReceivable,
    result: reconciliation.result,
    createdAt: reconciliation.createdAt,
    createdByUsername: reconciliation.createdByUsername,
  };
}

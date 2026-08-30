import { AgentReconciliation } from '../entities/agent-reconciliation.entity';

export const AGENT_RECONCILIATION_REPOSITORY = Symbol(
  'AGENT_RECONCILIATION_REPOSITORY',
);

export interface CreateAgentReconciliationData {
  date: string;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdBy: string;
}

export interface AgentReconciliationRepository {
  create(data: CreateAgentReconciliationData): Promise<AgentReconciliation>;
}

import {
  AgentReconciliationsReportRow,
  AgentReconciliationsReportSummary,
} from '../../domain/repositories/agent-reconciliations-report.repository';

export interface AgentReconciliationsReportRowOutput {
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

export function toAgentReconciliationsReportRowOutput(
  row: AgentReconciliationsReportRow,
): AgentReconciliationsReportRowOutput {
  return { ...row };
}

export interface AgentReconciliationsReportSummaryOutput {
  recordCount: number;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  totalResult: number;
  averageResult: number;
}

export function toAgentReconciliationsReportSummaryOutput(
  summary: AgentReconciliationsReportSummary,
): AgentReconciliationsReportSummaryOutput {
  return { ...summary };
}

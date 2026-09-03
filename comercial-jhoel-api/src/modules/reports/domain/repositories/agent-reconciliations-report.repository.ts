export const AGENT_RECONCILIATIONS_REPORT_REPOSITORY = Symbol(
  'AGENT_RECONCILIATIONS_REPORT_REPOSITORY',
);

export interface AgentReconciliationsReportFilters {
  startDate?: string;
  endDate?: string;
}

/**
 * One row per historical `agent_reconciliations` record — `date` is
 * deliberately NOT unique here (a date can legitimately have more than one
 * row across an admin reopen + recierre cycle, see
 * `TypeOrmAgentReconciliationRepository`'s own doc comments), so this report
 * must never dedupe by date or assume one row per day.
 */
export interface AgentReconciliationsReportRow {
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

export interface AgentReconciliationsReportSummary {
  recordCount: number;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  totalResult: number;
  averageResult: number;
}

export interface PaginatedAgentReconciliationsReportResult<T> {
  items: T[];
  total: number;
}

export interface AgentReconciliationsReportRepository {
  findAll(
    filters: AgentReconciliationsReportFilters,
    page: number,
    limit: number,
  ): Promise<
    PaginatedAgentReconciliationsReportResult<AgentReconciliationsReportRow>
  >;
  getSummary(
    filters: AgentReconciliationsReportFilters,
  ): Promise<AgentReconciliationsReportSummary>;
}

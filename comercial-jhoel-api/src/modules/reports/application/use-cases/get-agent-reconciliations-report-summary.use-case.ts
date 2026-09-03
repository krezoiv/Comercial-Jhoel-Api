import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATIONS_REPORT_REPOSITORY } from '../../domain/repositories/agent-reconciliations-report.repository';
import type { AgentReconciliationsReportRepository } from '../../domain/repositories/agent-reconciliations-report.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import {
  AgentReconciliationsReportSummaryOutput,
  toAgentReconciliationsReportSummaryOutput,
} from '../dtos/agent-reconciliations-report-output';

export interface GetAgentReconciliationsReportSummaryInput {
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class GetAgentReconciliationsReportSummaryUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY)
    private readonly repository: AgentReconciliationsReportRepository,
  ) {}

  async execute(
    input: GetAgentReconciliationsReportSummaryInput,
  ): Promise<AgentReconciliationsReportSummaryOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const summary = await this.repository.getSummary({
      startDate: input.startDate,
      endDate: input.endDate,
    });

    return toAgentReconciliationsReportSummaryOutput(summary);
  }
}

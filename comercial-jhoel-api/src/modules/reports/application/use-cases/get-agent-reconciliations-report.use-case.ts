import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATIONS_REPORT_REPOSITORY } from '../../domain/repositories/agent-reconciliations-report.repository';
import type { AgentReconciliationsReportRepository } from '../../domain/repositories/agent-reconciliations-report.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import {
  AgentReconciliationsReportRowOutput,
  toAgentReconciliationsReportRowOutput,
} from '../dtos/agent-reconciliations-report-output';

export interface GetAgentReconciliationsReportInput {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface GetAgentReconciliationsReportOutput {
  items: AgentReconciliationsReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class GetAgentReconciliationsReportUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATIONS_REPORT_REPOSITORY)
    private readonly repository: AgentReconciliationsReportRepository,
  ) {}

  async execute(
    input: GetAgentReconciliationsReportInput,
  ): Promise<GetAgentReconciliationsReportOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.repository.findAll(
      { startDate: input.startDate, endDate: input.endDate },
      page,
      limit,
    );

    return {
      items: result.items.map(toAgentReconciliationsReportRowOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

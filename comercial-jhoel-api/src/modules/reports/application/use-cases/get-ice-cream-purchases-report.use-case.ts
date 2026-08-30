import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_PURCHASES_REPORT_REPOSITORY } from '../../domain/repositories/ice-cream-purchases-report.repository';
import type { IceCreamPurchasesReportRepository } from '../../domain/repositories/ice-cream-purchases-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  IceCreamPurchasesReportRowOutput,
  toIceCreamPurchasesReportRowOutput,
} from '../dtos/ice-cream-purchases-report-output';

export interface GetIceCreamPurchasesReportInput {
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  supplierId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface GetIceCreamPurchasesReportOutput {
  items: IceCreamPurchasesReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class GetIceCreamPurchasesReportUseCase {
  constructor(
    @Inject(ICE_CREAM_PURCHASES_REPORT_REPOSITORY)
    private readonly iceCreamPurchasesReportRepository: IceCreamPurchasesReportRepository,
  ) {}

  async execute(
    input: GetIceCreamPurchasesReportInput,
  ): Promise<GetIceCreamPurchasesReportOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.iceCreamPurchasesReportRepository.findAll(
      {
        startDate,
        endDate,
        iceCreamId: input.iceCreamId,
        supplierId: input.supplierId,
        userId: input.userId,
      },
      page,
      limit,
    );

    return {
      items: result.items.map(toIceCreamPurchasesReportRowOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

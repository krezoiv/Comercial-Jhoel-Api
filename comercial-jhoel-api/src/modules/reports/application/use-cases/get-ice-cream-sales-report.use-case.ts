import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_SALES_REPORT_REPOSITORY } from '../../domain/repositories/ice-cream-sales-report.repository';
import type { IceCreamSalesReportRepository } from '../../domain/repositories/ice-cream-sales-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  IceCreamSalesReportRowOutput,
  toIceCreamSalesReportRowOutput,
} from '../dtos/ice-cream-sales-report-output';

export interface GetIceCreamSalesReportInput {
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  page?: number;
  limit?: number;
}

export interface GetIceCreamSalesReportOutput {
  items: IceCreamSalesReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

/** Structural clone of `GetSalesReportUseCase` — see that use case for the pattern; `GetIceCreamPurchasesReportUseCase`/both modules' own `*ReportSummaryUseCase` are the same clone relationship to their Sales/Purchases counterparts. */
@Injectable()
export class GetIceCreamSalesReportUseCase {
  constructor(
    @Inject(ICE_CREAM_SALES_REPORT_REPOSITORY)
    private readonly iceCreamSalesReportRepository: IceCreamSalesReportRepository,
  ) {}

  async execute(
    input: GetIceCreamSalesReportInput,
  ): Promise<GetIceCreamSalesReportOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.iceCreamSalesReportRepository.findAll(
      {
        startDate,
        endDate,
        iceCreamId: input.iceCreamId,
        userId: input.userId,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        minQuantity: input.minQuantity,
      },
      page,
      limit,
    );

    return {
      items: result.items.map(toIceCreamSalesReportRowOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  ReportSortField,
  SALES_REPORT_REPOSITORY,
  SortDirection,
} from '../../domain/repositories/sales-report.repository';
import type { SalesReportRepository } from '../../domain/repositories/sales-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  SalesReportRowOutput,
  toSalesReportRowOutput,
} from '../dtos/sales-report-output';

export interface GetSalesReportInput {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
  sortBy?: ReportSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface GetSalesReportOutput {
  items: SalesReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class GetSalesReportUseCase {
  constructor(
    @Inject(SALES_REPORT_REPOSITORY)
    private readonly salesReportRepository: SalesReportRepository,
  ) {}

  async execute(input: GetSalesReportInput): Promise<GetSalesReportOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.salesReportRepository.findAll(
      {
        startDate,
        endDate,
        categoryId: input.categoryId,
        businessId: input.businessId,
        productId: input.productId,
        userId: input.userId,
      },
      page,
      limit,
      input.sortBy ?? 'date',
      input.sortDirection ?? 'desc',
    );

    return {
      items: result.items.map(toSalesReportRowOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

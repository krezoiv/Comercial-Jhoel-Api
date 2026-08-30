import { Inject, Injectable } from '@nestjs/common';
import { SALES_REPORT_REPOSITORY } from '../../domain/repositories/sales-report.repository';
import type { SalesReportRepository } from '../../domain/repositories/sales-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  SalesReportSummaryOutput,
  toSalesReportSummaryOutput,
} from '../dtos/sales-report-output';

export interface GetSalesReportSummaryInput {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
}

@Injectable()
export class GetSalesReportSummaryUseCase {
  constructor(
    @Inject(SALES_REPORT_REPOSITORY)
    private readonly salesReportRepository: SalesReportRepository,
  ) {}

  async execute(
    input: GetSalesReportSummaryInput,
  ): Promise<SalesReportSummaryOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );

    const summary = await this.salesReportRepository.getSummary({
      startDate,
      endDate,
      categoryId: input.categoryId,
      businessId: input.businessId,
      productId: input.productId,
      userId: input.userId,
    });

    return toSalesReportSummaryOutput(summary);
  }
}

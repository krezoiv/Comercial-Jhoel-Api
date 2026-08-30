import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_SALES_REPORT_REPOSITORY } from '../../domain/repositories/ice-cream-sales-report.repository';
import type { IceCreamSalesReportRepository } from '../../domain/repositories/ice-cream-sales-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  IceCreamSalesReportSummaryOutput,
  toIceCreamSalesReportSummaryOutput,
} from '../dtos/ice-cream-sales-report-output';

export interface GetIceCreamSalesReportSummaryInput {
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
}

@Injectable()
export class GetIceCreamSalesReportSummaryUseCase {
  constructor(
    @Inject(ICE_CREAM_SALES_REPORT_REPOSITORY)
    private readonly iceCreamSalesReportRepository: IceCreamSalesReportRepository,
  ) {}

  async execute(
    input: GetIceCreamSalesReportSummaryInput,
  ): Promise<IceCreamSalesReportSummaryOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );

    const summary = await this.iceCreamSalesReportRepository.getSummary({
      startDate,
      endDate,
      iceCreamId: input.iceCreamId,
      userId: input.userId,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
      minQuantity: input.minQuantity,
    });

    return toIceCreamSalesReportSummaryOutput(summary);
  }
}

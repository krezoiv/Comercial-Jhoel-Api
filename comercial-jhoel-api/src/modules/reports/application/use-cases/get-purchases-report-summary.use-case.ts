import { Inject, Injectable } from '@nestjs/common';
import { PURCHASES_REPORT_REPOSITORY } from '../../domain/repositories/purchases-report.repository';
import type { PurchasesReportRepository } from '../../domain/repositories/purchases-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  PurchasesReportSummaryOutput,
  toPurchasesReportSummaryOutput,
} from '../dtos/purchases-report-output';

export interface GetPurchasesReportSummaryInput {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
}

@Injectable()
export class GetPurchasesReportSummaryUseCase {
  constructor(
    @Inject(PURCHASES_REPORT_REPOSITORY)
    private readonly purchasesReportRepository: PurchasesReportRepository,
  ) {}

  async execute(
    input: GetPurchasesReportSummaryInput,
  ): Promise<PurchasesReportSummaryOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );

    const summary = await this.purchasesReportRepository.getSummary({
      startDate,
      endDate,
      supplierId: input.supplierId,
      categoryId: input.categoryId,
      businessId: input.businessId,
      productId: input.productId,
      userId: input.userId,
    });

    return toPurchasesReportSummaryOutput(summary);
  }
}

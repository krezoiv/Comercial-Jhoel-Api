import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_PURCHASES_REPORT_REPOSITORY } from '../../domain/repositories/ice-cream-purchases-report.repository';
import type { IceCreamPurchasesReportRepository } from '../../domain/repositories/ice-cream-purchases-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  IceCreamPurchasesReportSummaryOutput,
  toIceCreamPurchasesReportSummaryOutput,
} from '../dtos/ice-cream-purchases-report-output';

export interface GetIceCreamPurchasesReportSummaryInput {
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  supplierId?: string;
  userId?: string;
}

@Injectable()
export class GetIceCreamPurchasesReportSummaryUseCase {
  constructor(
    @Inject(ICE_CREAM_PURCHASES_REPORT_REPOSITORY)
    private readonly iceCreamPurchasesReportRepository: IceCreamPurchasesReportRepository,
  ) {}

  async execute(
    input: GetIceCreamPurchasesReportSummaryInput,
  ): Promise<IceCreamPurchasesReportSummaryOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );

    const summary = await this.iceCreamPurchasesReportRepository.getSummary({
      startDate,
      endDate,
      iceCreamId: input.iceCreamId,
      supplierId: input.supplierId,
      userId: input.userId,
    });

    return toIceCreamPurchasesReportSummaryOutput(summary);
  }
}

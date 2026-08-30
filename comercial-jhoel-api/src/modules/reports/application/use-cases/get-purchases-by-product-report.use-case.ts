import { Inject, Injectable } from '@nestjs/common';
import { PURCHASES_REPORT_REPOSITORY } from '../../domain/repositories/purchases-report.repository';
import type { PurchasesReportRepository } from '../../domain/repositories/purchases-report.repository';
import { parseReportDateRange } from '../utils/parse-report-date-range';
import {
  PurchasesByProductRowOutput,
  toPurchasesByProductRowOutput,
} from '../dtos/purchases-report-output';

export interface GetPurchasesByProductReportInput {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface GetPurchasesByProductReportOutput {
  items: PurchasesByProductRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class GetPurchasesByProductReportUseCase {
  constructor(
    @Inject(PURCHASES_REPORT_REPOSITORY)
    private readonly purchasesReportRepository: PurchasesReportRepository,
  ) {}

  async execute(
    input: GetPurchasesByProductReportInput,
  ): Promise<GetPurchasesByProductReportOutput> {
    const { startDate, endDate } = parseReportDateRange(
      input.startDate,
      input.endDate,
    );
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.purchasesReportRepository.getByProduct(
      {
        startDate,
        endDate,
        supplierId: input.supplierId,
        categoryId: input.categoryId,
        businessId: input.businessId,
        productId: input.productId,
        userId: input.userId,
      },
      page,
      limit,
    );

    return {
      items: result.items.map(toPurchasesByProductRowOutput),
      total: result.total,
      page,
      limit,
    };
  }
}

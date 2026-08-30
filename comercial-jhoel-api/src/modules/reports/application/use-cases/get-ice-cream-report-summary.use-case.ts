import { Injectable } from '@nestjs/common';
import { GetIceCreamSalesReportSummaryUseCase } from './get-ice-cream-sales-report-summary.use-case';
import { GetIceCreamPurchasesReportSummaryUseCase } from './get-ice-cream-purchases-report-summary.use-case';
import { NoIceCreamMovementTypeSelectedError } from '../../domain/errors/no-ice-cream-movement-type-selected.error';
import { IceCreamReportSummaryOutput, IceCreamReportType } from '../dtos/ice-cream-report-output';

export interface GetIceCreamReportSummaryInput {
  types?: IceCreamReportType[];
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  userId?: string;
}

/** Each requested type's total is always a real SQL aggregate, via the same summary use cases the two now-removed standalone reports already used — never derived from a paginated/capped list. */
@Injectable()
export class GetIceCreamReportSummaryUseCase {
  constructor(
    private readonly getIceCreamSalesReportSummaryUseCase: GetIceCreamSalesReportSummaryUseCase,
    private readonly getIceCreamPurchasesReportSummaryUseCase: GetIceCreamPurchasesReportSummaryUseCase,
  ) {}

  async execute(input: GetIceCreamReportSummaryInput): Promise<IceCreamReportSummaryOutput> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoIceCreamMovementTypeSelectedError();
    }

    const wantsSales = types.includes('sales');
    const wantsPurchases = types.includes('purchases');

    const [salesSummary, purchasesSummary] = await Promise.all([
      wantsSales
        ? this.getIceCreamSalesReportSummaryUseCase.execute(input)
        : Promise.resolve({ totalSold: 0, totalQuantity: 0, recordCount: 0, averagePrice: 0 }),
      wantsPurchases
        ? this.getIceCreamPurchasesReportSummaryUseCase.execute(input)
        : Promise.resolve({ totalPurchased: 0, totalQuantity: 0, recordCount: 0, averageCost: 0 }),
    ]);

    return {
      totalSales: salesSummary.totalSold,
      totalPurchases: purchasesSummary.totalPurchased,
      difference: salesSummary.totalSold - purchasesSummary.totalPurchased,
      recordCount: salesSummary.recordCount + purchasesSummary.recordCount,
    };
  }
}

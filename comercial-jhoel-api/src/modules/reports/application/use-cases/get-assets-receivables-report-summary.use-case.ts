import { Injectable } from '@nestjs/common';
import { GetAssetsReportSummaryUseCase } from './get-assets-report-summary.use-case';
import { GetAccountsReceivableReportSummaryUseCase } from './get-accounts-receivable-report-summary.use-case';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import { NoReportTypeSelectedError } from '../../domain/errors/no-report-type-selected.error';
import { ReportStatusFilter } from '../utils/parse-report-status';
import { AssetsReceivablesReportSummaryOutput, AssetsReceivablesReportType } from '../dtos/assets-receivables-report-output';

export interface GetAssetsReceivablesReportSummaryInput {
  types?: AssetsReceivablesReportType[];
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatusFilter;
  search?: string;
}

/**
 * Each requested type's total is always a real SQL aggregate (via
 * `GetAssetsReportSummaryUseCase`/`GetAccountsReceivableReportSummaryUseCase`,
 * both already backed by `getReportSummary()` — see those use cases' own
 * doc comments) — never derived from whatever the list use case happened
 * to paginate/cap, so the Cards are always exactly correct regardless of
 * how the table is windowed.
 */
@Injectable()
export class GetAssetsReceivablesReportSummaryUseCase {
  constructor(
    private readonly getAssetsReportSummaryUseCase: GetAssetsReportSummaryUseCase,
    private readonly getAccountsReceivableReportSummaryUseCase: GetAccountsReceivableReportSummaryUseCase,
  ) {}

  async execute(
    input: GetAssetsReceivablesReportSummaryInput,
  ): Promise<AssetsReceivablesReportSummaryOutput> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoReportTypeSelectedError();
    }
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const wantsAssets = types.includes('assets');
    const wantsReceivables = types.includes('accounts_receivable');

    const [assetsSummary, receivablesSummary] = await Promise.all([
      wantsAssets
        ? this.getAssetsReportSummaryUseCase.execute(input)
        : Promise.resolve({ recordCount: 0, totalAmount: 0 }),
      wantsReceivables
        ? this.getAccountsReceivableReportSummaryUseCase.execute(input)
        : Promise.resolve({ recordCount: 0, totalAmount: 0 }),
    ]);

    return {
      totalAssets: assetsSummary.totalAmount,
      totalAccountsReceivable: receivablesSummary.totalAmount,
      totalGeneral: assetsSummary.totalAmount + receivablesSummary.totalAmount,
      recordCount: assetsSummary.recordCount + receivablesSummary.recordCount,
    };
  }
}

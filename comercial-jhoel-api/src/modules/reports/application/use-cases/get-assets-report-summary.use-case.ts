import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../../assets/domain/repositories/asset.repository';
import type { AssetRepository } from '../../../assets/domain/repositories/asset.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import { AssetsReportSummaryOutput } from '../dtos/assets-report-output';
import {
  ReportStatusFilter,
  parseReportStatus,
} from '../utils/parse-report-status';

export interface GetAssetsReportSummaryInput {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatusFilter;
  search?: string;
}

/** `date` is a plain DATE column on `assets` — same lexicographic-comparison reasoning as `GetAccountsReceivableReportSummaryUseCase`. */
@Injectable()
export class GetAssetsReportSummaryUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(
    input: GetAssetsReportSummaryInput,
  ): Promise<AssetsReportSummaryOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    return this.assetRepository.getReportSummary({
      isActive: parseReportStatus(input.status),
      clientId: input.clientId,
      dateFrom: input.startDate,
      dateTo: input.endDate,
      search: input.search?.trim() || undefined,
    });
  }
}

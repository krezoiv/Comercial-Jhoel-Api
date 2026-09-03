import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../../accounts-receivable/domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../../accounts-receivable/domain/repositories/account-receivable.repository';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import { AccountsReceivableReportSummaryOutput } from '../dtos/accounts-receivable-report-output';
import {
  ReportStatusFilter,
  parseReportStatus,
} from '../utils/parse-report-status';

export interface GetAccountsReceivableReportSummaryInput {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatusFilter;
  search?: string;
}

/**
 * `date` is a plain DATE column on `accounts_receivable` (see the module's
 * own migration comment), so — like Recargas' own report summary — a
 * lexicographic `yyyy-MM-dd` string comparison is already correct; no
 * `parseReportDateRange` start/end-of-day widening (needed for Sales'/
 * Purchases' `timestamptz` columns) applies here.
 */
@Injectable()
export class GetAccountsReceivableReportSummaryUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(
    input: GetAccountsReceivableReportSummaryInput,
  ): Promise<AccountsReceivableReportSummaryOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    return this.accountReceivableRepository.getReportSummary({
      isActive: parseReportStatus(input.status),
      clientId: input.clientId,
      dateFrom: input.startDate,
      dateTo: input.endDate,
      search: input.search?.trim() || undefined,
    });
  }
}

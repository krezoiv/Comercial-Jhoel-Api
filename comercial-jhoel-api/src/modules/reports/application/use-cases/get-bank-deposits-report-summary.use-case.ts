import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../../bank-deposits/domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../../bank-deposits/domain/repositories/bank-deposit.repository';
import { InvalidBankDepositDateRangeError } from '../../../bank-deposits/domain/errors/invalid-bank-deposit-date-range.error';
import { BankDepositsReportSummaryOutput } from '../dtos/bank-deposits-report-output';

export interface GetBankDepositsReportSummaryInput {
  startDate?: string;
  endDate?: string;
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
}

/** `operationDate` is a plain DATE column, so a lexicographic string comparison is already correct — same reasoning as `GetRechargesReportSummaryUseCase`. */
@Injectable()
export class GetBankDepositsReportSummaryUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(
    input: GetBankDepositsReportSummaryInput,
  ): Promise<BankDepositsReportSummaryOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankDepositDateRangeError();
    }

    return this.bankDepositRepository.getReportSummary({
      startDate: input.startDate,
      endDate: input.endDate,
      transactionBankId: input.transactionBankId,
      transactionTypeId: input.transactionTypeId,
      userId: input.userId,
    });
  }
}

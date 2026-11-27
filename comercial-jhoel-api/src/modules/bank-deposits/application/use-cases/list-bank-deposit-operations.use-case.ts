import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import {
  BankDepositOperationSummaryOutput,
  toBankDepositOperationSummaryOutput,
} from '../dtos/bank-deposit-output';
import { InvalidBankDepositDateRangeError } from '../../domain/errors/invalid-bank-deposit-date-range.error';

import type { OperationModality } from '../../domain/operation-modality';

export interface ListBankDepositOperationsInput {
  /** INDIVIDUAL / GRUPAL (Pagos grupales); omitted = both. */
  modality?: OperationModality;
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  /** Free text: description/beneficiary, client, transaction type or bank. */
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListBankDepositOperationsOutput {
  items: BankDepositOperationSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

/** Never restricted by ownership — a shared operational record, same access policy as Bancos/Recargas (see the module's plan). Reused directly by `BankDepositsReportController` (Reportería), same as `GetRechargeHistoryUseCase` is reused by `RechargesReportController`. */
@Injectable()
export class ListBankDepositOperationsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(
    input: ListBankDepositOperationsInput,
  ): Promise<ListBankDepositOperationsOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankDepositDateRangeError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.bankDepositRepository.findAll({
      modality: input.modality,
      transactionBankId: input.transactionBankId,
      transactionTypeId: input.transactionTypeId,
      userId: input.userId,
      startDate: input.startDate,
      endDate: input.endDate,
      search: input.search?.trim() || undefined,
      page,
      limit,
    });
    const links = await this.bankDepositRepository.findPaymentGroupLinks(
      result.items.map((operation) => operation.id),
    );
    return {
      items: result.items.map((operation) =>
        toBankDepositOperationSummaryOutput(
          operation,
          links.get(operation.id) ?? null,
        ),
      ),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

export interface ListTransactionBanksInput {
  includeInactive?: boolean;
}

@Injectable()
export class ListTransactionBanksUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(
    input: ListTransactionBanksInput = {},
  ): Promise<TransactionBankOutput[]> {
    const transactionBanks = await this.transactionBankRepository.findAll({
      activeOnly: !input.includeInactive,
    });
    return transactionBanks.map(toTransactionBankOutput);
  }
}

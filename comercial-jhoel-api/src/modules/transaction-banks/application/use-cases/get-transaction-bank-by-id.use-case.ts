import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

@Injectable()
export class GetTransactionBankByIdUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(id: string): Promise<TransactionBankOutput> {
    const transactionBank = await this.transactionBankRepository.findById(id);
    if (!transactionBank) {
      throw new TransactionBankNotFoundError(id);
    }
    return toTransactionBankOutput(transactionBank);
  }
}

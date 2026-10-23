import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

@Injectable()
export class RemoveTransactionBankImageUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(id: string, userId: string): Promise<TransactionBankOutput> {
    const bank = await this.transactionBankRepository.findById(id);
    if (!bank) {
      throw new TransactionBankNotFoundError(id);
    }
    await this.transactionBankRepository.removeImage(id, userId);
    const updated = await this.transactionBankRepository.findById(id);
    return toTransactionBankOutput(updated!);
  }
}

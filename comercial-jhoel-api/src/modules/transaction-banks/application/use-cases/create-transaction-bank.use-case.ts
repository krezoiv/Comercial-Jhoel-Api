import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNameAlreadyExistsError } from '../../domain/errors/transaction-bank-name-already-exists.error';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

export interface CreateTransactionBankInput {
  name: string;
  createdBy: string;
}

@Injectable()
export class CreateTransactionBankUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(
    input: CreateTransactionBankInput,
  ): Promise<TransactionBankOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing =
      await this.transactionBankRepository.findByActiveName(name);
    if (existing) {
      throw new TransactionBankNameAlreadyExistsError(name);
    }

    const transactionBank = await this.transactionBankRepository.create({
      name,
      createdBy: input.createdBy,
    });
    return toTransactionBankOutput(transactionBank);
  }
}

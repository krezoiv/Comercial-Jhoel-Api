import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import { TransactionBankNameAlreadyExistsError } from '../../domain/errors/transaction-bank-name-already-exists.error';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

export interface UpdateTransactionBankInput {
  name?: string;
  updatedBy: string;
}

@Injectable()
export class UpdateTransactionBankUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateTransactionBankInput,
  ): Promise<TransactionBankOutput> {
    const transactionBank = await this.transactionBankRepository.findById(id);
    if (!transactionBank) {
      throw new TransactionBankNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name !== transactionBank.name) {
      const existing =
        await this.transactionBankRepository.findByActiveName(name);
      if (existing) {
        throw new TransactionBankNameAlreadyExistsError(name);
      }
    }

    const updated = await this.transactionBankRepository.update(id, {
      ...(name ? { name } : {}),
      updatedBy: input.updatedBy,
    });

    return toTransactionBankOutput(updated);
  }
}

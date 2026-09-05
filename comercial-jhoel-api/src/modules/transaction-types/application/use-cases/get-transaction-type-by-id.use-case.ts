import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { TransactionTypeNotFoundError } from '../../domain/errors/transaction-type-not-found.error';
import {
  TransactionTypeOutput,
  toTransactionTypeOutput,
} from '../dtos/transaction-type-output';

@Injectable()
export class GetTransactionTypeByIdUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(id: string): Promise<TransactionTypeOutput> {
    const transactionType = await this.transactionTypeRepository.findById(id);
    if (!transactionType) {
      throw new TransactionTypeNotFoundError(id);
    }
    return toTransactionTypeOutput(transactionType);
  }
}

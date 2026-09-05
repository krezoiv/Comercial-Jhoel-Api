import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import {
  TransactionTypeOutput,
  toTransactionTypeOutput,
} from '../dtos/transaction-type-output';

export interface ListTransactionTypesInput {
  includeInactive?: boolean;
}

@Injectable()
export class ListTransactionTypesUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(
    input: ListTransactionTypesInput = {},
  ): Promise<TransactionTypeOutput[]> {
    const transactionTypes = await this.transactionTypeRepository.findAll({
      activeOnly: !input.includeInactive,
    });
    return transactionTypes.map(toTransactionTypeOutput);
  }
}

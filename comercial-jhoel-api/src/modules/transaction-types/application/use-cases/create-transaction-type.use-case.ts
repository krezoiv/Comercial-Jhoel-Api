import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { TransactionTypeNameAlreadyExistsError } from '../../domain/errors/transaction-type-name-already-exists.error';
import {
  TransactionTypeOutput,
  toTransactionTypeOutput,
} from '../dtos/transaction-type-output';

export interface CreateTransactionTypeInput {
  name: string;
  icon: string;
  createdBy: string;
}

@Injectable()
export class CreateTransactionTypeUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(
    input: CreateTransactionTypeInput,
  ): Promise<TransactionTypeOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing =
      await this.transactionTypeRepository.findByActiveName(name);
    if (existing) {
      throw new TransactionTypeNameAlreadyExistsError(name);
    }

    const transactionType = await this.transactionTypeRepository.create({
      name,
      icon: input.icon,
      createdBy: input.createdBy,
    });
    return toTransactionTypeOutput(transactionType);
  }
}

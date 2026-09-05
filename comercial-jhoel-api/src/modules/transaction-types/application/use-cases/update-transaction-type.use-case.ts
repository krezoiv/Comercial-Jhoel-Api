import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { TransactionTypeNotFoundError } from '../../domain/errors/transaction-type-not-found.error';
import { TransactionTypeNameAlreadyExistsError } from '../../domain/errors/transaction-type-name-already-exists.error';
import {
  TransactionTypeOutput,
  toTransactionTypeOutput,
} from '../dtos/transaction-type-output';

export interface UpdateTransactionTypeInput {
  name?: string;
  icon?: string;
  updatedBy: string;
}

@Injectable()
export class UpdateTransactionTypeUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateTransactionTypeInput,
  ): Promise<TransactionTypeOutput> {
    const transactionType = await this.transactionTypeRepository.findById(id);
    if (!transactionType) {
      throw new TransactionTypeNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name !== transactionType.name) {
      const existing =
        await this.transactionTypeRepository.findByActiveName(name);
      if (existing) {
        throw new TransactionTypeNameAlreadyExistsError(name);
      }
    }

    const updated = await this.transactionTypeRepository.update(id, {
      ...(name ? { name } : {}),
      ...(input.icon ? { icon: input.icon } : {}),
      updatedBy: input.updatedBy,
    });

    return toTransactionTypeOutput(updated);
  }
}

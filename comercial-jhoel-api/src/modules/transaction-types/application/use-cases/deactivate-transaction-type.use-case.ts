import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { TransactionTypeNotFoundError } from '../../domain/errors/transaction-type-not-found.error';

/** Soft delete only — DELETE /transaction-types/:id never removes the row (historical bank-deposit operations keep referencing it). */
@Injectable()
export class DeactivateTransactionTypeUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const transactionType = await this.transactionTypeRepository.findById(id);
    if (!transactionType) {
      throw new TransactionTypeNotFoundError(id);
    }
    await this.transactionTypeRepository.deactivate(id);
  }
}

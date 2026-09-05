import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';

/** Soft delete only — DELETE /transaction-banks/:id never removes the row (historical bank-deposit operations keep referencing it). */
@Injectable()
export class DeactivateTransactionBankUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const transactionBank = await this.transactionBankRepository.findById(id);
    if (!transactionBank) {
      throw new TransactionBankNotFoundError(id);
    }
    await this.transactionBankRepository.deactivate(id);
  }
}

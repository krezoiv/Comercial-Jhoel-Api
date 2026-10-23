import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type {
  TransactionBankImageBytes,
  TransactionBankRepository,
} from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';

@Injectable()
export class GetTransactionBankImageUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(id: string): Promise<TransactionBankImageBytes> {
    const image = await this.transactionBankRepository.getImage(id);
    if (!image) {
      throw new TransactionBankNotFoundError(id);
    }
    return image;
  }
}

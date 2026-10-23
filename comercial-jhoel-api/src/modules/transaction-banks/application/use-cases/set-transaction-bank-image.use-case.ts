import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_BANK_REPOSITORY } from '../../domain/repositories/transaction-bank.repository';
import type { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import {
  assertValidTransactionBankImage,
  UploadedTransactionBankImage,
} from '../utils/assert-valid-transaction-bank-image';
import {
  TransactionBankOutput,
  toTransactionBankOutput,
} from '../dtos/transaction-bank-output';

export interface SetTransactionBankImageInput {
  transactionBankId: string;
  image: UploadedTransactionBankImage | undefined;
  userId: string;
}

/** Logo del banco agente — solo identificación visual (icono del modal de Transaccionar); no toca ninguna regla financiera. */
@Injectable()
export class SetTransactionBankImageUseCase {
  constructor(
    @Inject(TRANSACTION_BANK_REPOSITORY)
    private readonly transactionBankRepository: TransactionBankRepository,
  ) {}

  async execute(
    input: SetTransactionBankImageInput,
  ): Promise<TransactionBankOutput> {
    const bank = await this.transactionBankRepository.findById(
      input.transactionBankId,
    );
    if (!bank) {
      throw new TransactionBankNotFoundError(input.transactionBankId);
    }
    assertValidTransactionBankImage(input.image);
    await this.transactionBankRepository.setImage(
      input.transactionBankId,
      {
        data: input.image.buffer,
        mimeType: input.image.mimetype,
        sizeBytes: input.image.size,
      },
      input.userId,
    );
    const updated = await this.transactionBankRepository.findById(
      input.transactionBankId,
    );
    return toTransactionBankOutput(updated!);
  }
}

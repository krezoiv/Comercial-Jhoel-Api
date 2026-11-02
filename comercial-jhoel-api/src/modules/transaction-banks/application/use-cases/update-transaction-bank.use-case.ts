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
  /** `true` marca Cooperativa Guayacán; `false` la desmarca (deja de generar comisión — el histórico queda intacto). */
  isGuayacan?: boolean;
  commissionPerTransaction?: number;
  updatedBy: string;
}

/** Tarifa por defecto al marcar Guayacán sin indicar una — la única copia; luego vive en `transaction_banks.commission_per_transaction`. */
export const DEFAULT_GUAYACAN_COMMISSION = 3;

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

    // Comisión: solo existe junto con la marca Guayacán (CHECK en la tabla).
    let cashBox: {
      cashBoxCode: 'GUAYACAN' | null;
      commissionPerTransaction: number | null;
    } | null = null;
    if (input.isGuayacan === true) {
      cashBox = {
        cashBoxCode: 'GUAYACAN',
        commissionPerTransaction:
          input.commissionPerTransaction ??
          transactionBank.commissionPerTransaction ??
          DEFAULT_GUAYACAN_COMMISSION,
      };
    } else if (input.isGuayacan === false) {
      cashBox = { cashBoxCode: null, commissionPerTransaction: null };
    } else if (
      input.commissionPerTransaction !== undefined &&
      transactionBank.cashBoxCode
    ) {
      cashBox = {
        cashBoxCode: transactionBank.cashBoxCode,
        commissionPerTransaction: input.commissionPerTransaction,
      };
    }

    const updated = await this.transactionBankRepository.update(id, {
      ...(name ? { name } : {}),
      ...(cashBox ?? {}),
      updatedBy: input.updatedBy,
    });

    return toTransactionBankOutput(updated);
  }
}

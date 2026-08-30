import { Inject, Injectable } from '@nestjs/common';
import { BANK_BALANCE_REPOSITORY } from '../../domain/repositories/bank-balance.repository';
import type { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import {
  InvalidBankBalanceDateError,
  NoBankBalancesToSaveError,
} from '../../domain/errors/invalid-bank-balance.error';

export interface SaveBankBalancesEntryInput {
  bankId: string;
  finalBalance: number;
}

export interface SaveBankBalancesInput {
  operationDate: string;
  userId: string;
  entries: SaveBankBalancesEntryInput[];
}

export interface SaveBankBalancesOutput {
  savedCount: number;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Saves every entered bank's cuadre for one operation date as a single
 * atomic batch (see `TypeOrmBankBalanceRepository.saveBalances` — one outer
 * transaction wrapping one `save_bank_balance()` call per entry): either
 * every bank in the batch is recorded, or none are.
 */
@Injectable()
export class SaveBankBalancesUseCase {
  constructor(
    @Inject(BANK_BALANCE_REPOSITORY)
    private readonly bankBalanceRepository: BankBalanceRepository,
  ) {}

  async execute(input: SaveBankBalancesInput): Promise<SaveBankBalancesOutput> {
    if (!input.operationDate || !DATE_PATTERN.test(input.operationDate)) {
      throw new InvalidBankBalanceDateError();
    }

    if (!input.entries || input.entries.length === 0) {
      throw new NoBankBalancesToSaveError();
    }

    const savedCount = await this.bankBalanceRepository.saveBalances({
      operationDate: input.operationDate,
      userId: input.userId,
      entries: input.entries,
    });

    return { savedCount };
  }
}

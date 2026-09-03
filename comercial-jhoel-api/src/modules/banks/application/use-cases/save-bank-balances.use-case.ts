import { Inject, Injectable } from '@nestjs/common';
import { BANK_BALANCE_REPOSITORY } from '../../domain/repositories/bank-balance.repository';
import type { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import {
  InvalidBankBalanceDateError,
  NoBankBalancesToSaveError,
} from '../../domain/errors/invalid-bank-balance.error';
import { DayNotOpenedError } from '../../domain/errors/day-not-opened.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import { todayIsoDate } from '../utils/today-iso-date';

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
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(input: SaveBankBalancesInput): Promise<SaveBankBalancesOutput> {
    if (!input.operationDate || !DATE_PATTERN.test(input.operationDate)) {
      throw new InvalidBankBalanceDateError();
    }

    if (!input.entries || input.entries.length === 0) {
      throw new NoBankBalancesToSaveError();
    }

    // The mandatory "Apertura del Día" sequencing only applies to today's
    // operating date — correcting a past date's balances is pre-existing
    // functionality this ticket was required to preserve unchanged, so it
    // never demands a retroactive opening for a historical date.
    const dayOpening = await this.dayOpeningRepository.findByDate(input.operationDate);
    if (input.operationDate === todayIsoDate() && !dayOpening) {
      throw new DayNotOpenedError(input.operationDate, 'balances');
    }

    // "Cierre del Día" — once a date is closed, no further balances can be
    // saved for it through the normal flow, whether it's today or a past
    // date being corrected. Independent of the rule above: a closed day
    // always blocks, regardless of which of the two cases it was.
    if (dayOpening?.isClosed) {
      throw new DayAlreadyClosedError(input.operationDate);
    }

    const savedCount = await this.bankBalanceRepository.saveBalances({
      operationDate: input.operationDate,
      userId: input.userId,
      entries: input.entries,
    });

    return { savedCount };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BANK_BALANCE_REPOSITORY } from '../../domain/repositories/bank-balance.repository';
import type { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import { InvalidBankBalanceDateError } from '../../domain/errors/invalid-bank-balance.error';
import {
  BankBalanceViewOutput,
  toBankBalanceViewOutput,
} from '../dtos/bank-balance-view-output';

export interface GetBankBalancesViewInput {
  operationDate: string;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class GetBankBalancesViewUseCase {
  constructor(
    @Inject(BANK_BALANCE_REPOSITORY)
    private readonly bankBalanceRepository: BankBalanceRepository,
  ) {}

  async execute(
    input: GetBankBalancesViewInput,
  ): Promise<BankBalanceViewOutput[]> {
    if (!input.operationDate || !DATE_PATTERN.test(input.operationDate)) {
      throw new InvalidBankBalanceDateError();
    }

    const views = await this.bankBalanceRepository.findBalancesView(
      input.operationDate,
    );
    return views.map(toBankBalanceViewOutput);
  }
}

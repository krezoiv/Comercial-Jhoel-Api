import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { BankOutput, toBankOutput } from '../dtos/bank-output';

export interface ListBanksInput {
  search?: string;
  includeInactive?: boolean;
}

@Injectable()
export class ListBanksUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
  ) {}

  async execute(input: ListBanksInput = {}): Promise<BankOutput[]> {
    const banks = await this.bankRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
    });
    return banks.map(toBankOutput);
  }
}

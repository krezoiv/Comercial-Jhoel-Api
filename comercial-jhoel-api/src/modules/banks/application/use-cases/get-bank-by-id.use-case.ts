import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { BankNotFoundError } from '../../domain/errors/bank-not-found.error';
import { BankOutput, toBankOutput } from '../dtos/bank-output';

@Injectable()
export class GetBankByIdUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
  ) {}

  async execute(id: string): Promise<BankOutput> {
    const bank = await this.bankRepository.findById(id);
    if (!bank) {
      throw new BankNotFoundError(id);
    }
    return toBankOutput(bank);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { BankNotFoundError } from '../../domain/errors/bank-not-found.error';

/** Soft delete only — DELETE /banks/:id never removes the row, and every past bank_balances entry keeps referencing it (RESTRICT FK, never CASCADE). */
@Injectable()
export class DeactivateBankUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const bank = await this.bankRepository.findById(id);
    if (!bank) {
      throw new BankNotFoundError(id);
    }
    await this.bankRepository.deactivate(id);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { AccountReceivableNotFoundError } from '../../domain/errors/account-receivable-not-found.error';

/** Soft delete only — DELETE /accounts-receivable/:id never removes the row, preserving historial integrity. */
@Injectable()
export class DeactivateAccountReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const record = await this.accountReceivableRepository.findById(id);
    if (!record) {
      throw new AccountReceivableNotFoundError();
    }
    await this.accountReceivableRepository.deactivate(id);
  }
}

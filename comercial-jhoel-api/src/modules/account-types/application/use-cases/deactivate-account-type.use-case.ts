import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE_REPOSITORY } from '../../domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../domain/repositories/account-type.repository';
import { AccountTypeNotFoundError } from '../../domain/errors/account-type-not-found.error';

/** Soft delete only — DELETE /account-types/:id never removes the row. */
@Injectable()
export class DeactivateAccountTypeUseCase {
  constructor(
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const accountType = await this.accountTypeRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFoundError(id);
    }
    await this.accountTypeRepository.deactivate(id);
  }
}

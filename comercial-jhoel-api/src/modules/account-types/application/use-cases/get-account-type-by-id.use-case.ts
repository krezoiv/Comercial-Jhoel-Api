import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE_REPOSITORY } from '../../domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../domain/repositories/account-type.repository';
import { AccountTypeNotFoundError } from '../../domain/errors/account-type-not-found.error';
import {
  AccountTypeOutput,
  toAccountTypeOutput,
} from '../dtos/account-type-output';

@Injectable()
export class GetAccountTypeByIdUseCase {
  constructor(
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(id: string): Promise<AccountTypeOutput> {
    const accountType = await this.accountTypeRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFoundError(id);
    }
    return toAccountTypeOutput(accountType);
  }
}

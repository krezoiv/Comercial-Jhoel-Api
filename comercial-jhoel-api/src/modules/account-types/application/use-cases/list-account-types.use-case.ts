import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE_REPOSITORY } from '../../domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../domain/repositories/account-type.repository';
import {
  AccountTypeOutput,
  toAccountTypeOutput,
} from '../dtos/account-type-output';

export interface ListAccountTypesInput {
  includeInactive?: boolean;
}

@Injectable()
export class ListAccountTypesUseCase {
  constructor(
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(
    input: ListAccountTypesInput = {},
  ): Promise<AccountTypeOutput[]> {
    const accountTypes = await this.accountTypeRepository.findAll({
      activeOnly: !input.includeInactive,
    });
    return accountTypes.map(toAccountTypeOutput);
  }
}

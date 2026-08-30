import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE_REPOSITORY } from '../../domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../domain/repositories/account-type.repository';
import { AccountTypeNotFoundError } from '../../domain/errors/account-type-not-found.error';
import { AccountTypeNameAlreadyExistsError } from '../../domain/errors/account-type-name-already-exists.error';
import {
  AccountTypeOutput,
  toAccountTypeOutput,
} from '../dtos/account-type-output';

export interface UpdateAccountTypeInput {
  name?: string;
  updatedBy: string;
}

@Injectable()
export class UpdateAccountTypeUseCase {
  constructor(
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateAccountTypeInput,
  ): Promise<AccountTypeOutput> {
    const accountType = await this.accountTypeRepository.findById(id);
    if (!accountType) {
      throw new AccountTypeNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name !== accountType.name) {
      const existing = await this.accountTypeRepository.findByActiveName(name);
      if (existing) {
        throw new AccountTypeNameAlreadyExistsError(name);
      }
    }

    const updated = await this.accountTypeRepository.update(id, {
      ...(name ? { name } : {}),
      updatedBy: input.updatedBy,
    });

    return toAccountTypeOutput(updated);
  }
}

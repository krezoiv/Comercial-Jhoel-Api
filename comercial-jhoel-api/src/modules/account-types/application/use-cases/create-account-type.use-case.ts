import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE_REPOSITORY } from '../../domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../domain/repositories/account-type.repository';
import { AccountTypeNameAlreadyExistsError } from '../../domain/errors/account-type-name-already-exists.error';
import {
  AccountTypeOutput,
  toAccountTypeOutput,
} from '../dtos/account-type-output';

export interface CreateAccountTypeInput {
  name: string;
  createdBy: string;
}

@Injectable()
export class CreateAccountTypeUseCase {
  constructor(
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(input: CreateAccountTypeInput): Promise<AccountTypeOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing = await this.accountTypeRepository.findByActiveName(name);
    if (existing) {
      throw new AccountTypeNameAlreadyExistsError(name);
    }

    const accountType = await this.accountTypeRepository.create({
      name,
      createdBy: input.createdBy,
    });
    return toAccountTypeOutput(accountType);
  }
}

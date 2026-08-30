import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { AccountReceivableNotFoundError } from '../../domain/errors/account-receivable-not-found.error';
import {
  AccountReceivableOutput,
  toAccountReceivableOutput,
} from '../dtos/account-receivable-output';

@Injectable()
export class GetAccountReceivableByIdUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(id: string): Promise<AccountReceivableOutput> {
    const record = await this.accountReceivableRepository.findById(id);
    if (!record) {
      throw new AccountReceivableNotFoundError();
    }
    return toAccountReceivableOutput(record);
  }
}

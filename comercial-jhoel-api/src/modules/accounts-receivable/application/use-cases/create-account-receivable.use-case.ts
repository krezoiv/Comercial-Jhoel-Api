import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import {
  ReferencedClientInactiveError,
  ReferencedClientNotFoundError,
} from '../../domain/errors/referenced-client-invalid.error';
import {
  AccountReceivableOutput,
  toAccountReceivableOutput,
} from '../dtos/account-receivable-output';

export interface CreateAccountReceivableInput {
  clientId: string;
  date: string;
  amount: number;
  description?: string;
  createdBy: string;
}

@Injectable()
export class CreateAccountReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    input: CreateAccountReceivableInput,
  ): Promise<AccountReceivableOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }
    if (!client.isActive) {
      throw new ReferencedClientInactiveError();
    }

    const description = input.description?.trim().replace(/\s+/g, ' ') || null;

    const record = await this.accountReceivableRepository.create({
      clientId: input.clientId,
      date: input.date,
      amount: input.amount,
      description,
      createdBy: input.createdBy,
    });

    return toAccountReceivableOutput(record);
  }
}

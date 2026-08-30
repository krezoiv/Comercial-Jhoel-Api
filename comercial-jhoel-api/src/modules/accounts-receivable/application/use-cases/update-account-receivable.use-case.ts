import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { AccountReceivableNotFoundError } from '../../domain/errors/account-receivable-not-found.error';
import {
  ReferencedClientInactiveError,
  ReferencedClientNotFoundError,
} from '../../domain/errors/referenced-client-invalid.error';
import {
  AccountReceivableOutput,
  toAccountReceivableOutput,
} from '../dtos/account-receivable-output';

export interface UpdateAccountReceivableInput {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
  updatedBy: string;
}

@Injectable()
export class UpdateAccountReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateAccountReceivableInput,
  ): Promise<AccountReceivableOutput> {
    const record = await this.accountReceivableRepository.findById(id);
    if (!record) {
      throw new AccountReceivableNotFoundError();
    }

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client) {
        throw new ReferencedClientNotFoundError();
      }
      if (!client.isActive) {
        throw new ReferencedClientInactiveError();
      }
    }

    const description =
      input.description !== undefined
        ? input.description?.trim().replace(/\s+/g, ' ') || null
        : undefined;

    const updated = await this.accountReceivableRepository.update(id, {
      ...(input.clientId ? { clientId: input.clientId } : {}),
      ...(input.date ? { date: input.date } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(description !== undefined ? { description } : {}),
      updatedBy: input.updatedBy,
    });

    return toAccountReceivableOutput(updated);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { ReferencedClientNotFoundError } from '../../domain/errors/referenced-client-invalid.error';

/** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch. */
@Injectable()
export class GetAccountReceivableCurrentBalanceUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(clientId: string): Promise<{ balance: number }> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }

    const balance =
      await this.accountReceivableRepository.getCurrentBalance(clientId);
    return { balance };
  }
}

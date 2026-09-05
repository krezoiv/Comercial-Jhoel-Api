import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { ReferencedClientNotFoundError } from '../../domain/errors/referenced-client-invalid.error';
import {
  AccountReceivableStatementOutput,
  toAccountReceivableStatementOutput,
} from '../dtos/account-receivable-statement-output';

export interface GetAccountReceivableStatementInput {
  clientId: string;
  dateFrom?: string;
  dateTo?: string;
}

/** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. Never iterates full history client-side; the repository derives everything with one bounded, window-function query. */
@Injectable()
export class GetAccountReceivableStatementUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    input: GetAccountReceivableStatementInput,
  ): Promise<AccountReceivableStatementOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }

    const statement = await this.accountReceivableRepository.getStatement(
      input.clientId,
      { dateFrom: input.dateFrom, dateTo: input.dateTo },
    );

    return toAccountReceivableStatementOutput(statement);
  }
}

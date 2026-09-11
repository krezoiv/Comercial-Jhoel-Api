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
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';

export interface RegisterAccountReceivableChargeInput {
  clientId: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
  /** Polymorphic origin tag — omitted by the standalone "Registrar Cargo" endpoint (the only caller before Transaccionar's own integration). Set together when this charge is a side effect of another module's write. */
  referenceType?: string;
  referenceId?: string;
  /** Present when the caller (e.g. `RegisterBankDepositOperationUseCase`) needs this write to commit or roll back atomically alongside another module's write, via `TransactionManager.runInTransaction`. Omitted by every other caller. */
  context?: TransactionContext;
}

/** "Registrar Cargo" for Cuentas por Cobrar — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning). */
@Injectable()
export class RegisterAccountReceivableChargeUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    input: RegisterAccountReceivableChargeInput,
  ): Promise<AccountReceivableOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }
    if (!client.isActive) {
      throw new ReferencedClientInactiveError();
    }

    const description = input.description?.trim().replace(/\s+/g, ' ') || null;

    const movement = await this.accountReceivableRepository.registerMovement(
      {
        clientId: input.clientId,
        movementType: 'CARGO',
        amount: input.amount,
        date: input.date,
        description,
        createdBy: input.createdBy,
        referenceType: input.referenceType ?? null,
        referenceId: input.referenceId ?? null,
      },
      input.context,
    );

    return toAccountReceivableOutput(movement);
  }
}

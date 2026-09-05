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

export interface RegisterAccountReceivableChargeInput {
  clientId: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
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

    const movement = await this.accountReceivableRepository.registerMovement({
      clientId: input.clientId,
      movementType: 'CARGO',
      amount: input.amount,
      date: input.date,
      description,
      createdBy: input.createdBy,
    });

    return toAccountReceivableOutput(movement);
  }
}

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

export interface RegisterAccountReceivablePaymentInput {
  clientId: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
}

/**
 * "Registrar Abono" for Cuentas por Cobrar. Does NOT pre-check the amount
 * against the current balance here — `register_account_receivable_movement`
 * itself computes the balance fresh inside a per-client advisory lock and
 * rejects an over-payment atomically (`AbonoExceedsBalanceError`), which is
 * what actually prevents two concurrent abonos from both succeeding
 * incorrectly against the same pending balance. A TypeScript-side
 * pre-check here would only create a TOCTOU gap, not close one.
 */
@Injectable()
export class RegisterAccountReceivablePaymentUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    input: RegisterAccountReceivablePaymentInput,
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
      movementType: 'ABONO',
      amount: input.amount,
      date: input.date,
      description,
      createdBy: input.createdBy,
    });

    return toAccountReceivableOutput(movement);
  }
}

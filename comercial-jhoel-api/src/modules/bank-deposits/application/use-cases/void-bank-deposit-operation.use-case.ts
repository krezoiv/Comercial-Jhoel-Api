import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { BankDepositOperationNotFoundError } from '../../domain/errors/bank-deposit-operation-not-found.error';
import { BankDepositOperationAlreadyVoidedError } from '../../domain/errors/bank-deposit-operation-already-voided.error';
import {
  BankDepositOperationOutput,
  toBankDepositOperationOutput,
} from '../dtos/bank-deposit-output';

export interface VoidBankDepositOperationInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * The correction path for a mistaken Transaccionar registration — never an
 * edit, never a physical delete. Marks the operation `isVoided`; the row,
 * its cash details, and its transactions are all left exactly as registered,
 * forever, for audit purposes. `totalAmount`/`totalCash`/`totalDistributed`
 * are never touched — a voided operation's own numbers stay whatever was
 * actually cuadrado at the moment it was (mistakenly) registered.
 *
 * Admin-only (enforced at the controller via `@Roles`), same policy as
 * "Gestión de Días Cerrados"' reopen/cancel actions and Recargas' saldo-final
 * re-edit — correcting an already-registered financial record is a
 * management action, not an operational one, even though registering the
 * original operation is open to any authenticated account.
 */
@Injectable()
export class VoidBankDepositOperationUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(
    input: VoidBankDepositOperationInput,
  ): Promise<BankDepositOperationOutput> {
    const operation = await this.bankDepositRepository.findById(input.id);
    if (!operation) {
      throw new BankDepositOperationNotFoundError(input.id);
    }
    if (operation.isVoided) {
      throw new BankDepositOperationAlreadyVoidedError(input.id);
    }

    const voided = await this.bankDepositRepository.voidOperation(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toBankDepositOperationOutput(voided);
  }
}

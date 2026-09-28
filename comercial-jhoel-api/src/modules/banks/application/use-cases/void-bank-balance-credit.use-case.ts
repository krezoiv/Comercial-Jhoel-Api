import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import {
  BankBalanceCreditNotFoundError,
  MovementReasonRequiredError,
} from '../../domain/errors/bank-movement.errors';
import { BankMovementOutput } from '../dtos/bank-movement-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface VoidBankBalanceCreditInput {
  /** Id de la operación (`reference_id` del movimiento ACREDITACION_SALDO). */
  operationId: string;
  reason: string;
  userId: string;
}

/**
 * Anular una acreditación de saldo — nunca la borra: `void_bank_balance_credit`
 * reutiliza `reverse_bank_account_movements`, que registra el movimiento
 * inverso (ANULACION, −monto) y marca el original como ANULADO; ambos quedan
 * en el historial. Solo admin, sin validación de día abierto — mismo
 * criterio que anular una transferencia.
 */
@Injectable()
export class VoidBankBalanceCreditUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(input: VoidBankBalanceCreditInput): Promise<BankMovementOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new MovementReasonRequiredError();
    }

    await this.bankMovementRepository.voidBalanceCredit(
      input.operationId,
      todayIsoDate(),
      input.userId,
      reason,
    );

    const movements = await this.bankMovementRepository.findByReference(
      'ACREDITACION_SALDO',
      input.operationId,
    );
    const credit = movements.find((m) => m.movementType === 'ACREDITACION_SALDO');
    if (!credit) {
      throw new BankBalanceCreditNotFoundError(input.operationId);
    }
    return credit;
  }
}

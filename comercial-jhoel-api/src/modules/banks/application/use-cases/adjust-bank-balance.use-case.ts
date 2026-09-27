import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { MovementReasonRequiredError } from '../../domain/errors/bank-movement.errors';
import { BankMovementOutput } from '../dtos/bank-movement-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface AdjustBankBalanceInput {
  bankId: string;
  newBalance: number;
  reason: string;
  observation?: string | null;
  userId: string;
}

/**
 * "Ajustar saldo" — la única vía para corregir a mano el saldo actual de
 * una cuenta. Solo admin/super_admin (lo exige el controlador con
 * `@Roles`). Nunca sobrescribe ni borra historial: `adjust_bank_balance`
 * registra la diferencia como un movimiento AJUSTE_MANUAL con saldo
 * anterior, saldo nuevo, motivo, observación, usuario y fecha.
 */
@Injectable()
export class AdjustBankBalanceUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(input: AdjustBankBalanceInput): Promise<BankMovementOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new MovementReasonRequiredError();
    }

    return this.bankMovementRepository.adjustBalance({
      bankId: input.bankId,
      newBalance: input.newBalance,
      businessDate: todayIsoDate(),
      userId: input.userId,
      reason,
      observation: input.observation?.trim() || null,
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/recharge-cash-box-movement.repository';
import type { RechargeCashBoxMovementRepository } from '../../domain/repositories/recharge-cash-box-movement.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { todayIsoDate } from '../utils/today-iso-date';
import {
  CashBoxMovementOutput,
  toCashBoxMovementOutput,
} from '../dtos/cash-box-movement-record-output';

export interface RegisterCashBoxContributionInput {
  amount: number;
  concept: string;
  userId: string;
  /** `yyyy-MM-dd` — defaults to today; a contribution can be backdated the same way every other Recargas write already allows (see `assertValidOperationDate`). */
  businessDate?: string;
}

/**
 * "Aporte a Caja" — a manual cash contribution, the mirror-image income
 * counterpart to "Salida de Ganancia" (see
 * `RegisterCashBoxWithdrawalUseCase`). Unlike a withdrawal, a contribution
 * never needs a balance check — it only ever adds, so
 * `register_recharge_cash_box_movement` skips the
 * `WITHDRAWAL_EXCEEDS_BALANCE` guard entirely when `movementType ===
 * 'CONTRIBUTION'` (see the migration's own doc comment).
 */
@Injectable()
export class RegisterCashBoxContributionUseCase {
  constructor(
    @Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly cashBoxRepository: RechargeCashBoxMovementRepository,
  ) {}

  async execute(
    input: RegisterCashBoxContributionInput,
  ): Promise<CashBoxMovementOutput> {
    const businessDate = input.businessDate ?? todayIsoDate();
    assertValidOperationDate(businessDate);

    const movement = await this.cashBoxRepository.registerMovement({
      amount: input.amount,
      movementType: 'CONTRIBUTION',
      businessDate,
      concept: input.concept,
      userId: input.userId,
    });

    return toCashBoxMovementOutput(movement);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/recharge-cash-box-movement.repository';
import type { RechargeCashBoxMovementRepository } from '../../domain/repositories/recharge-cash-box-movement.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { todayIsoDate } from '../utils/today-iso-date';
import {
  CashBoxMovementOutput,
  toCashBoxMovementOutput,
} from '../dtos/cash-box-movement-record-output';

export interface RegisterCashBoxWithdrawalInput {
  amount: number;
  concept: string;
  userId: string;
  /** `yyyy-MM-dd` — defaults to today; a withdrawal can be backdated the same way every other Recargas write already allows (see `assertValidOperationDate`). */
  businessDate?: string;
}

/**
 * "Salida de Ganancia" — one of the two Caja Contable movements that isn't
 * derived from an existing sale/purchase table (the other is "Aporte a
 * Caja", see `RegisterCashBoxContributionUseCase`). Amount/balance
 * validation is intentionally NOT duplicated here:
 * `register_recharge_cash_box_movement` computes the available balance and
 * rejects an over-limit withdrawal atomically, inside its own advisory
 * lock — a TypeScript-side pre-check would only add a TOCTOU gap, not close
 * one (same reasoning already established for the Kardex financiero
 * payment use cases). A contribution never has this check — it can never
 * "exceed" anything, it only ever adds.
 */
@Injectable()
export class RegisterCashBoxWithdrawalUseCase {
  constructor(
    @Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly cashBoxRepository: RechargeCashBoxMovementRepository,
  ) {}

  async execute(
    input: RegisterCashBoxWithdrawalInput,
  ): Promise<CashBoxMovementOutput> {
    const businessDate = input.businessDate ?? todayIsoDate();
    assertValidOperationDate(businessDate);

    const movement = await this.cashBoxRepository.registerMovement({
      amount: input.amount,
      movementType: 'WITHDRAWAL',
      businessDate,
      concept: input.concept,
      userId: input.userId,
    });

    return toCashBoxMovementOutput(movement);
  }
}

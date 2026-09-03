import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { assertRechargeDayWritable } from '../utils/assert-recharge-day-writable';
import {
  RechargeDailyBalanceOutput,
  toRechargeDailyBalanceOutput,
} from '../dtos/recharge-daily-balance-output';

export interface RegisterRechargePurchaseInput {
  rechargeTypeId: string;
  /** "Monto de Compra" — informational only, never affects the balance. */
  purchaseAmount: number;
  /** "Monto Acreditado" — the only value that increments the running balance. */
  creditedAmount: number;
  userId: string;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

/**
 * Registers against the caller's chosen operation date (the frontend's
 * date picker, defaulting to today) rather than always assuming today —
 * `assertValidOperationDate` is the only guard against backdating this into
 * the future; genuine backdating into the past is the whole point of this
 * follow-up ("catch up on a day I forgot to close"). Type/active/amount
 * validation, the movement record, and the running-total increment all
 * happen atomically inside `register_recharge_purchase()` — this use case
 * only shapes the input/output, validates the date, and (via
 * `assertRechargeDayWritable`) checks the Recargas day-lifecycle gate
 * (today must be opened; any date must not already be closed) before
 * delegating.
 */
@Injectable()
export class RegisterRechargePurchaseUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(
    input: RegisterRechargePurchaseInput,
  ): Promise<RechargeDailyBalanceOutput> {
    assertValidOperationDate(input.operationDate);
    await assertRechargeDayWritable(
      this.dayOpeningRepository,
      input.operationDate,
    );

    const balance = await this.dailyBalanceRepository.registerPurchase({
      rechargeTypeId: input.rechargeTypeId,
      date: input.operationDate,
      purchaseAmount: input.purchaseAmount,
      creditedAmount: input.creditedAmount,
      userId: input.userId,
    });

    return toRechargeDailyBalanceOutput(balance);
  }
}

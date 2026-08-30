import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { DailyBalanceNotFoundError } from '../../domain/errors/daily-balance-not-found.error';
import { FinalBalanceEditForbiddenError } from '../../domain/errors/final-balance-edit-forbidden.error';
import {
  RechargeDailyBalanceOutput,
  toRechargeDailyBalanceOutput,
} from '../dtos/recharge-daily-balance-output';

export interface RegisterRechargeFinalBalanceInput {
  dailyBalanceId: string;
  finalBalance: number;
  userId: string;
  isAdmin: boolean;
}

/**
 * The negative/exceeds-daily validation lives inside
 * `register_recharge_final_balance()` — this use case only owns one rule
 * that genuinely belongs at the application layer instead: whether the
 * caller is *allowed* to call it again on a day that's already closed.
 * The first close of a day is an operational action (any authenticated
 * account, mirroring Sales/Purchases' own "any authenticated" policy for
 * their operational writes); *correcting* an already-closed day is
 * elevated to admin-only, the same "sensitive once it's historical" idea
 * `RoleFormModalComponent`'s system-role lock and this app's other
 * once-confirmed-stays-confirmed rules already apply elsewhere.
 */
@Injectable()
export class RegisterRechargeFinalBalanceUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(
    input: RegisterRechargeFinalBalanceInput,
  ): Promise<RechargeDailyBalanceOutput> {
    const existing = await this.dailyBalanceRepository.findById(
      input.dailyBalanceId,
    );
    if (!existing) {
      throw new DailyBalanceNotFoundError(input.dailyBalanceId);
    }
    if (existing.finalBalance !== null && !input.isAdmin) {
      throw new FinalBalanceEditForbiddenError();
    }

    const updated = await this.dailyBalanceRepository.registerFinalBalance({
      dailyBalanceId: input.dailyBalanceId,
      finalBalance: input.finalBalance,
      userId: input.userId,
    });

    return toRechargeDailyBalanceOutput(updated);
  }
}

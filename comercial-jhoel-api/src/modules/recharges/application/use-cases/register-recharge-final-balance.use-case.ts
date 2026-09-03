import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { DailyBalanceNotFoundError } from '../../domain/errors/daily-balance-not-found.error';
import { FinalBalanceEditForbiddenError } from '../../domain/errors/final-balance-edit-forbidden.error';
import { assertRechargeDayWritable } from '../utils/assert-recharge-day-writable';
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
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
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

    // Checked before the admin-re-edit rule below on purpose: a day
    // explicitly closed via "Cerrar Día" blocks even an admin's direct
    // correction — reopening the DAY (Sistema → Gestión de Días de
    // Recargas) is the correct, explicit path back in, not a silent
    // bypass through this endpoint.
    await assertRechargeDayWritable(this.dayOpeningRepository, existing.date);

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

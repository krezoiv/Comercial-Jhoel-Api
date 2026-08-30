import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from '../../domain/repositories/recharge-sales-closure.repository';
import type { RechargeSalesClosureRepository } from '../../domain/repositories/recharge-sales-closure.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { RechargeSalesSummaryOutput } from '../dtos/recharge-sales-summary-output';
import { GetRechargeSalesSummaryUseCase } from './get-recharge-sales-summary.use-case';

export interface RegisterRechargeSalesClosureInput {
  totalCollected: number;
  userId: string;
  isAdmin: boolean;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

/**
 * Closes the CURRENT cuadre cycle for `operationDate` and — on a genuine
 * first close — immediately starts a fresh one, carrying each type's just-
 * closed `finalBalance` forward as the new cycle's `previousBalance`
 * (`register_recharge_sales_closure`'s own job, not this use case's).
 * `total_sales`/`result` are always recomputed fresh from real data inside
 * that function — this use case never trusts or forwards a caller-supplied
 * total, only `totalCollected` and the operation date.
 *
 * The FIRST/RE-edit permission split (mirrors `RegisterRechargeFinalBalanceUseCase`'s
 * identical rule: first close is operational, re-closing an already-closed
 * cycle is admin-only) is enforced INSIDE the stored function now, not as a
 * pre-check here — see the migration's own comment for why an app-layer
 * pre-check would leave a race window a concurrent first-save could slip
 * through. `isAdmin` is simply forwarded to the repository call.
 *
 * Reuses `GetRechargeSalesSummaryUseCase` for its response instead of
 * re-deriving the same totalClaro/totalTigo/totalSales shape a second time
 * — the ticket's own "no duplicar lógica existente" instruction applies to
 * new code within this same module too, not just the pre-existing one. The
 * response this returns reflects the date's state AFTER the reset, so a
 * successful save naturally shows a fresh, empty cycle — this is what
 * makes "Guardar cuadre" also read as "the screen is ready for a new
 * cuadre" without any separate frontend-side reset step.
 */
@Injectable()
export class RegisterRechargeSalesClosureUseCase {
  constructor(
    @Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)
    private readonly closureRepository: RechargeSalesClosureRepository,
    private readonly getRechargeSalesSummaryUseCase: GetRechargeSalesSummaryUseCase,
  ) {}

  async execute(
    input: RegisterRechargeSalesClosureInput,
  ): Promise<RechargeSalesSummaryOutput> {
    assertValidOperationDate(input.operationDate);

    await this.closureRepository.registerClosure({
      date: input.operationDate,
      totalCollected: input.totalCollected,
      userId: input.userId,
      isAdmin: input.isAdmin,
    });

    return this.getRechargeSalesSummaryUseCase.execute(input.operationDate);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type {
  AgentReconciliationRepository,
  CuadreCashBreakdownData,
} from '../../domain/repositories/agent-reconciliation.repository';
import { CuadreCashBreakdownError } from '../../domain/errors/cuadre-cash-breakdown.error';
import {
  breakdownTotal,
  isValidDenomination,
  toCents,
} from '../../../cash-control/domain/cash-denominations';
import { assertCashCustodyPermission } from '../../../cash-control/domain/policies/cash-control.policy';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { GetCuadreAgentesSummaryUseCase } from './get-cuadre-agentes-summary.use-case';
import { ValidateBankBalancesForDateUseCase } from './validate-bank-balances-for-date.use-case';
import { BankBalancesNotRegisteredError } from '../../domain/errors/bank-balances-not-registered.error';
import { DayNotOpenedError } from '../../domain/errors/day-not-opened.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import {
  AgentReconciliationOutput,
  toAgentReconciliationOutput,
} from '../dtos/agent-reconciliation-output';

export interface CloseAgentDayInput {
  totalCash: number;
  date: string;
  userId: string;
  /** JWT role — needed only when the breakdown comes from an Arqueo de Caja. */
  role?: string;
  /** Denomination breakdown behind `totalCash` (optional; the UI always sends it). */
  cashBreakdown?: CuadreCashBreakdownData | null;
}

/**
 * Validates a cuadre's cash breakdown before any database round-trip:
 * known denominations (Q200 … Q0.01), whole quantities ≥ 0, one row per
 * denomination, exact total (integer centavos) equal to `totalCash`, and a
 * consistent origin. The SQL function re-checks all of it, plus the source
 * arqueo's validity, under the same transaction as the close.
 */
export function assertCuadreCashBreakdown(
  totalCash: number,
  breakdown: CuadreCashBreakdownData,
  role: string | undefined,
): void {
  const seen = new Set<number>();
  for (const row of breakdown.details) {
    const cents = toCents(row.denomination);
    if (
      !isValidDenomination(row.denomination) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 0 ||
      seen.has(cents)
    ) {
      throw new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID');
    }
    seen.add(cents);
  }
  if ((breakdown.source === 'ARQUEO_CAJA') !== !!breakdown.sourceCashCountId) {
    throw new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID');
  }
  if (toCents(breakdownTotal(breakdown.details)) !== toCents(totalCash)) {
    throw new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_MISMATCH');
  }
  if (breakdown.source === 'ARQUEO_CAJA') {
    try {
      assertCashCustodyPermission(role, 'cash_custody.view');
    } catch {
      throw new CuadreCashBreakdownError('CUADRE_SOURCE_COUNT_FORBIDDEN');
    }
  }
}

/**
 * "Guardar Cuadre" is no longer just a historical `INSERT` — since the
 * "Cierre del Día" ticket, it also officially closes that date's working
 * cycle (`day_openings.closed_at`) in the same atomic operation (see
 * `AgentReconciliationRepository.closeDayWithReconciliation` /
 * `close_agent_day` in the database). There is no path where the
 * reconciliation ends up saved without the day being closed, or vice versa.
 *
 * The three validations ("is it open?", "are balances saved?", "is it
 * already closed?") are checked here BEFORE touching the database — same
 * as before this ticket — and are checked again inside the SQL function
 * itself under the `day_openings` row lock: this layer is what gives the
 * specific error message and avoids the database round-trip in the common
 * case; the SQL function is the real guarantee against a race between two
 * near-simultaneous saves for the same date.
 *
 * Optional cash breakdown (denominations + origin MANUAL/ARQUEO_CAJA): it
 * must add up exactly to `totalCash` and is saved as an independent
 * photograph; the source arqueo is only read, never modified.
 *
 * `totalCash` remains the only value accepted from the client —
 * `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` are always
 * recomputed here from `GetCuadreAgentesSummaryUseCase`, never taken from
 * the request body.
 */
@Injectable()
export class CloseAgentDayUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATION_REPOSITORY)
    private readonly repository: AgentReconciliationRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    private readonly getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase,
    private readonly validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase,
  ) {}

  async execute(input: CloseAgentDayInput): Promise<AgentReconciliationOutput> {
    if (input.cashBreakdown) {
      assertCuadreCashBreakdown(
        input.totalCash,
        input.cashBreakdown,
        input.role,
      );
    }

    const dayOpening = await this.dayOpeningRepository.findByDate(input.date);
    if (!dayOpening) {
      throw new DayNotOpenedError(input.date, 'reconciliation');
    }

    if (dayOpening.isClosed) {
      throw new DayAlreadyClosedError(input.date);
    }

    const balancesValidation =
      await this.validateBankBalancesForDateUseCase.execute(input.date);
    if (!balancesValidation.canReconcile) {
      throw new BankBalancesNotRegisteredError(input.date);
    }

    const summary = await this.getCuadreAgentesSummaryUseCase.execute();

    // Consolidated cuadre: the caja count + the cash under Bodega custody.
    const result =
      input.totalCash +
      summary.totalWarehouseCash +
      summary.totalBanks +
      summary.totalAccountsReceivable -
      summary.totalAssets;

    const record = await this.repository.closeDayWithReconciliation({
      date: input.date,
      totalCash: input.totalCash,
      totalWarehouseCash: summary.totalWarehouseCash,
      totalBanks: summary.totalBanks,
      totalAssets: summary.totalAssets,
      totalAccountsReceivable: summary.totalAccountsReceivable,
      result,
      userId: input.userId,
      cashBreakdown: input.cashBreakdown ?? null,
    });

    return toAgentReconciliationOutput(record);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type {
  AgentReconciliationRepository,
  CuadreCashBreakdownData,
  CuadreDenominationRow,
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
  /** Denomination breakdown behind `totalCash` — the caja count of the "Arqueo de Caja". */
  cashBreakdown?: CuadreCashBreakdownData | null;
  /** Physical Bodega count of the "Arqueo de Caja" (independent from the caja count). */
  warehouseDetails?: CuadreDenominationRow[] | null;
  observations?: string | null;
}

/**
 * Same row rules as the caja breakdown (known denomination, whole quantity
 * ≥ 0, one row per denomination) for the physical Bodega count. Returns its
 * total, which is the Bodega that enters the result.
 */
export function assertCuadreWarehouseBreakdown(
  details: CuadreDenominationRow[],
): number {
  const seen = new Set<number>();
  for (const row of details) {
    const cents = toCents(row.denomination);
    if (
      !isValidDenomination(row.denomination) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 0 ||
      seen.has(cents)
    ) {
      throw new CuadreCashBreakdownError('CUADRE_WAREHOUSE_BREAKDOWN_INVALID');
    }
    seen.add(cents);
  }
  return toCents(breakdownTotal(details)) / 100;
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
  if ((breakdown.source !== 'MANUAL') !== !!breakdown.sourceCashCountId) {
    throw new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID');
  }
  if (toCents(breakdownTotal(breakdown.details)) !== toCents(totalCash)) {
    throw new CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_MISMATCH');
  }
  if (breakdown.source !== 'MANUAL') {
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
 * "Arqueo de Caja" (required since migration 1760008800000, owner
 * decision): two independent physical counts — the caja breakdown (origin
 * MANUAL / CORTE_CAJA / ARQUEO_CAJA, must add up exactly to `totalCash`)
 * and the Bodega breakdown. Both are saved as a photograph together with
 * the theoretical balance of each location and every difference (caja,
 * Bodega and consolidated — individual differences are never netted). The
 * source arqueo, the Kardexes and the balances are only read.
 *
 * Result = caja contada + Bodega CONTADA + bancos + CxC − activos − listas
 * por trasladar (owner decision: a Bodega shortage must show in the result).
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
    if (!input.cashBreakdown || !input.warehouseDetails) {
      throw new CuadreCashBreakdownError('CUADRE_CUSTODY_COUNT_REQUIRED');
    }
    assertCuadreCashBreakdown(input.totalCash, input.cashBreakdown, input.role);
    const warehouseCounted = assertCuadreWarehouseBreakdown(
      input.warehouseDetails,
    );

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

    // Consolidated cuadre: the caja count + the PHYSICAL Bodega count,
    // minus the school-list money that is in the banks but belongs to the
    // Caja de Listas (stored apart so the result can be recomputed).
    const result =
      Math.round(
        (input.totalCash +
          warehouseCounted +
          summary.totalBanks +
          summary.totalAccountsReceivable -
          summary.totalAssets -
          summary.totalSchoolListPending) *
          100,
      ) / 100;

    const record = await this.repository.closeDayWithReconciliation({
      date: input.date,
      totalCash: input.totalCash,
      totalWarehouseCash: warehouseCounted,
      totalSchoolListPending: summary.totalSchoolListPending,
      totalBanks: summary.totalBanks,
      totalAssets: summary.totalAssets,
      totalAccountsReceivable: summary.totalAccountsReceivable,
      result,
      userId: input.userId,
      cashBreakdown: input.cashBreakdown,
      warehouseDetails: input.warehouseDetails,
      observations: input.observations?.trim() || null,
    });

    return toAgentReconciliationOutput(record);
  }
}

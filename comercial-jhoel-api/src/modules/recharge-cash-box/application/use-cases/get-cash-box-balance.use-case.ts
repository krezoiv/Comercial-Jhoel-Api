import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/recharge-cash-box-movement.repository';
import type { RechargeCashBoxMovementRepository } from '../../domain/repositories/recharge-cash-box-movement.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { todayIsoDate } from '../utils/today-iso-date';
import { CashBoxBalanceOutput } from '../dtos/cash-box-balance-output';

/** Rounds a chained sum/subtraction of already-2-decimal money values back to 2 decimals — plain JS float arithmetic on several such values (e.g. `109.98 + 50`) can otherwise surface a binary-representation artifact like `159.98000000000002` in the response. The underlying columns are all `NUMERIC(12,2)`; only the display-time JS math needs this guard. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface GetCashBoxBalanceInput {
  /** `yyyy-MM-dd`, defaults to today (business date, America/Guatemala) — see `todayIsoDate()`. */
  date?: string;
}

/**
 * Computes "Saldo Anterior" / "Ingresos Hoy" / "Salidas Hoy" / "Saldo
 * Actual" for one calendar day — never stored, always derived live from the
 * same live source tables `register_recharge_cash_box_movement` itself
 * reads (plus non-voided manual movements — "Aporte a Caja" counts as
 * income, "Salida de Ganancia" as expense). Two calls to `getDailyTotals`
 * — one strictly BEFORE `date` (the accumulated balance that becomes
 * "saldo anterior"), one ON `date` (today's own ingresos/salidas
 * breakdown) — are all the arithmetic needs; there is no per-day snapshot
 * row anywhere to keep in sync.
 */
@Injectable()
export class GetCashBoxBalanceUseCase {
  constructor(
    @Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly cashBoxRepository: RechargeCashBoxMovementRepository,
  ) {}

  async execute(input: GetCashBoxBalanceInput): Promise<CashBoxBalanceOutput> {
    const date = input.date ?? todayIsoDate();
    assertValidOperationDate(date);

    const [before, onDate] = await Promise.all([
      this.cashBoxRepository.getDailyTotals({ beforeDate: date }),
      this.cashBoxRepository.getDailyTotals({ onDate: date }),
    ]);

    const previousBalance = round2(
      before.salesRecharges +
        before.salesSim +
        before.contributions -
        before.purchasesRecharges -
        before.purchasesSim -
        before.withdrawals,
    );

    const incomeToday = round2(
      onDate.salesRecharges + onDate.salesSim + onDate.contributions,
    );
    const expenseToday = round2(
      onDate.purchasesRecharges + onDate.purchasesSim + onDate.withdrawals,
    );

    return {
      date,
      previousBalance,
      incomeToday,
      expenseToday,
      currentBalance: round2(previousBalance + incomeToday - expenseToday),
      detail: {
        salesRecharges: round2(onDate.salesRecharges),
        salesSim: round2(onDate.salesSim),
        contributions: round2(onDate.contributions),
        purchasesRecharges: round2(onDate.purchasesRecharges),
        purchasesSim: round2(onDate.purchasesSim),
        profitWithdrawals: round2(onDate.withdrawals),
      },
    };
  }
}

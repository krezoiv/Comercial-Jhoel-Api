import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from '../../domain/repositories/recharge-sales-closure.repository';
import type { RechargeSalesClosureRepository } from '../../domain/repositories/recharge-sales-closure.repository';
import { RECHARGE_SALE_REPOSITORY } from '../../domain/repositories/recharge-sale.repository';
import type { RechargeSaleRepository } from '../../domain/repositories/recharge-sale.repository';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { RechargeSalesSummaryOutput } from '../dtos/recharge-sales-summary-output';

/**
 * `totalClaro`/`totalTigo` are the one deliberately-named-by-operator spot
 * in this module — everywhere else (`recharge_types`, the daily table) is
 * fully normalized/extensible, but the ticket that requested this summary
 * explicitly asked for these two named fields, and the summary Card's
 * layout is genuinely two fixed rows today. Adding a third operator later
 * means adding one more named field here, not a migration — a small,
 * contained cost, worth it to avoid over-generalizing a DTO nothing else
 * needs yet (see the `application/dtos/` note this file's neighbor entities
 * already follow: derive/duplicate calls are made per-field, not
 * dogmatically).
 */
const KNOWN_RECHARGE_TYPE_NAMES = { CLARO: 'Claro', TIGO: 'Tigo' } as const;

@Injectable()
export class GetRechargeSalesSummaryUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly dailyBalanceRepository: RechargeDailyBalanceRepository,
    @Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)
    private readonly closureRepository: RechargeSalesClosureRepository,
    @Inject(RECHARGE_SALE_REPOSITORY)
    private readonly saleRepository: RechargeSaleRepository,
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly simSaleRegistrationRepository: RechargeSimSaleRegistrationRepository,
  ) {}

  async execute(
    date: string = todayIsoDate(),
  ): Promise<RechargeSalesSummaryOutput> {
    assertValidOperationDate(date);

    // `totalClaro`/`totalTigo`/`totalSales` are sourced from the individual
    // `recharge_sales` rows recorded for each type's CURRENT cycle — not
    // from `dailyBalance - finalBalance` (that inferred figure is still
    // shown per-operator on the daily table as "Venta", but the cuadre's
    // own totals now come from real recorded transactions, per this
    // module's "no permitir que el usuario modifique manualmente los
    // totales de ventas" requirement: they must be calculated automatically
    // from `ventasDiarias`, not inferred). This updates live as sales are
    // added/edited/removed — it does NOT wait for `finalBalance` to be
    // registered, unlike the old balance-diff figure.
    const totals = await this.saleRepository.getCurrentCycleTotalsByDate(date);
    const totalClaro =
      totals.find((t) => t.rechargeTypeName === KNOWN_RECHARGE_TYPE_NAMES.CLARO)
        ?.total ?? 0;
    const totalTigo =
      totals.find((t) => t.rechargeTypeName === KNOWN_RECHARGE_TYPE_NAMES.TIGO)
        ?.total ?? 0;
    const totalSales = totals.reduce((sum, t) => sum + t.total, 0);

    // "Ventas de SIM" — both the pre-existing by-quantity "Vender SIM" flow
    // and the new identity-registration flow count here (see
    // `RechargeSimSaleRegistrationRepository.getTotalByDate`'s own doc
    // comment for exactly how each is weighted) — this is the one and only
    // place SIM revenue enters Total Recaudado.
    const totalSimSales = await this.simSaleRegistrationRepository.getTotalByDate(date);
    const totalRecaudado = totalSales + totalSimSales;

    // Still needed to resolve the CURRENT cycle's own sequence number (to
    // look up a saved closure) — `findAllByDate` already resolves each
    // type's highest-`sequence` row, so a date that's already had one or
    // more "Guardar cuadre" resets today still resolves the CURRENT cycle,
    // not a stale one.
    const balances = await this.dailyBalanceRepository.findAllByDate(date);

    // The CURRENT cycle's own sequence — every active type shares one
    // (see the migration's own comment) — defaulting to 1 for a date
    // nobody has touched yet, matching `register_recharge_sales_closure`'s
    // identical fallback.
    const sequence = balances.reduce((max, b) => Math.max(max, b.sequence), 1);
    const closure = await this.closureRepository.findByDateAndSequence(
      date,
      sequence,
    );

    return {
      date,
      totalClaro,
      totalTigo,
      totalSales,
      totalSimSales,
      totalRecaudado,
      totalCollected: closure ? closure.totalCollected : null,
      difference: closure ? closure.result : null,
      savedClosure: closure !== null,
    };
  }
}

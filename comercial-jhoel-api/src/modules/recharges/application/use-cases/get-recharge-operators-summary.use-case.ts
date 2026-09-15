import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_TYPE_REPOSITORY } from '../../domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';
import { todayIsoDate } from '../utils/today-iso-date';

export interface RechargeOperatorStatOutput {
  rechargeTypeId: string;
  rechargeTypeName: string;
  salesThisMonth: number;
  purchasesThisMonth: number;
  /** De `findLatestPerType()` — la misma fuente que ya usa el módulo de Alertas, nunca recalculado. */
  currentBalance: number;
  balanceLimit: number;
}

export interface RechargeOperatorsSummaryOutput {
  /** `yyyy-MM` */
  month: string;
  operators: RechargeOperatorStatOutput[];
}

/**
 * Backs "Indicadores de Recargas Electrónicas" en Resumen — 4 gráficas de
 * anillo (Ventas Tigo/Claro, Compras Tigo/Claro, Saldo Claro, Saldo Tigo).
 * Un solo endpoint combinado en vez de 4 llamadas separadas: 3 consultas
 * agregadas (ventas por tipo, compras por tipo, saldo actual por tipo, esta
 * última ya existente y reutilizada de `findLatestPerType()` — la misma
 * fuente de verdad que ya usa el módulo de Alertas para "saldo bajo").
 */
@Injectable()
export class GetRechargeOperatorsSummaryUseCase {
  constructor(
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly rechargeDailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(): Promise<RechargeOperatorsSummaryOutput> {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startDate = `${monthPrefix}-01`;
    const endDate = todayIsoDate();

    const [types, salesRows, purchaseRows, latestBalances] = await Promise.all([
      this.rechargeTypeRepository.findAll({ activeOnly: true }),
      this.rechargeDailyBalanceRepository.getMonthlySalesTotalsByType(
        startDate,
        endDate,
      ),
      this.rechargeDailyBalanceRepository.getMonthlyPurchaseTotalsByType(
        startDate,
        endDate,
      ),
      this.rechargeDailyBalanceRepository.findLatestPerType(),
    ]);

    const salesByType = new Map(
      salesRows.map((row) => [row.rechargeTypeId, row.amount]),
    );
    const purchasesByType = new Map(
      purchaseRows.map((row) => [row.rechargeTypeId, row.amount]),
    );
    const balanceByType = new Map(
      latestBalances.map((balance) => [
        balance.rechargeTypeId,
        balance.dailyBalance,
      ]),
    );

    const operators: RechargeOperatorStatOutput[] = types.map((type) => ({
      rechargeTypeId: type.id,
      rechargeTypeName: type.name,
      salesThisMonth: salesByType.get(type.id) ?? 0,
      purchasesThisMonth: purchasesByType.get(type.id) ?? 0,
      currentBalance: balanceByType.get(type.id) ?? 0,
      balanceLimit: type.balanceLimit,
    }));

    return { month: monthPrefix, operators };
  }
}

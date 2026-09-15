import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';

export interface RechargesDailyStatOutput {
  /** `yyyy-MM-dd` */
  date: string;
  amount: number;
}

export interface RechargesDailyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  /** One entry per calendar day of the current month — a day with no closed cuadre cycle is `amount: 0`, never omitted. */
  days: RechargesDailyStatOutput[];
}

/**
 * "Recargas del mes" — Gráficas → Indicadores de Recargas. Venta total
 * combinada Claro + Tigo (`SUM(daily_balance - final_balance)` de todos
 * los ciclos cerrados ese día, sin separar por operador — ya confirmado
 * con el usuario), mismo criterio exacto que el indicador de Resumen ya
 * usa (`TypeOrmDashboardRepository.getRechargeSalesByDay`), ahora expuesto
 * vía `getDailySalesTotals` para que ambas pantallas nunca puedan
 * disagreer.
 */
@Injectable()
export class GetRechargesDailyStatsUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly rechargeDailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(): Promise<RechargesDailyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const startDate = `${monthPrefix}-01`;
    const endDate = `${monthPrefix}-${String(daysInMonth).padStart(2, '0')}`;

    const rows = await this.rechargeDailyBalanceRepository.getDailySalesTotals(startDate, endDate);
    const amountsByDate = new Map(rows.map((row) => [row.date, row.amount]));

    const days: RechargesDailyStatOutput[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      days.push({ date, amount: amountsByDate.get(date) ?? 0 });
    }

    return { month: monthPrefix, days };
  }
}

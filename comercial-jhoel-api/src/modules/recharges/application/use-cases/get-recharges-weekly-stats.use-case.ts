import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';

export interface RechargesWeeklyStatOutput {
  weekNumber: number;
  /** "Semana N" */
  label: string;
  /** `yyyy-MM-dd` */
  startDate: string;
  /** `yyyy-MM-dd` */
  endDate: string;
  amount: number;
}

export interface RechargesWeeklyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  weeks: RechargesWeeklyStatOutput[];
}

const DAYS_PER_WEEK_BUCKET = 7;

/**
 * "Recargas por semana" — buckets de 7 días fijos desde el día 1 del mes
 * actual, nunca semana ISO — mismo criterio exacto que las gráficas
 * semanales de Ventas/Compras/Transacciones. Reutiliza la misma consulta
 * día-a-día que la gráfica diaria (`getDailySalesTotals`) — ninguna
 * consulta SQL nueva.
 */
@Injectable()
export class GetRechargesWeeklyStatsUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly rechargeDailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(): Promise<RechargesWeeklyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const startDate = `${monthPrefix}-01`;
    const endDate = `${monthPrefix}-${String(daysInMonth).padStart(2, '0')}`;

    const rows = await this.rechargeDailyBalanceRepository.getDailySalesTotals(startDate, endDate);
    const amountsByDate = new Map(rows.map((row) => [row.date, row.amount]));

    const weeks: RechargesWeeklyStatOutput[] = [];
    for (let startDay = 1; startDay <= daysInMonth; startDay += DAYS_PER_WEEK_BUCKET) {
      const endDay = Math.min(startDay + DAYS_PER_WEEK_BUCKET - 1, daysInMonth);
      let amount = 0;
      for (let day = startDay; day <= endDay; day++) {
        const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
        amount += amountsByDate.get(date) ?? 0;
      }
      const weekNumber = weeks.length + 1;
      weeks.push({
        weekNumber,
        label: `Semana ${weekNumber}`,
        startDate: `${monthPrefix}-${String(startDay).padStart(2, '0')}`,
        endDate: `${monthPrefix}-${String(endDay).padStart(2, '0')}`,
        amount,
      });
    }

    return { month: monthPrefix, weeks };
  }
}

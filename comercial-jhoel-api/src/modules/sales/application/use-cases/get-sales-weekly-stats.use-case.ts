import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';

export interface SalesWeeklyStatOutput {
  weekNumber: number;
  /** "Semana N" */
  label: string;
  /** `yyyy-MM-dd` */
  startDate: string;
  /** `yyyy-MM-dd` */
  endDate: string;
  amount: number;
}

export interface SalesWeeklyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  weeks: SalesWeeklyStatOutput[];
}

const DAYS_PER_WEEK_BUCKET = 7;

/**
 * "Ventas por semana" — buckets de 7 días fijos desde el día 1 del mes
 * actual (día 1-7 = Semana 1, 8-14 = Semana 2, ...), nunca semana ISO —
 * mismo criterio exacto que `GetBankDepositWeeklyStatsUseCase` ya
 * estableció, para que un bucket nunca mezcle días de otro mes. Reutiliza
 * la misma consulta día-a-día que la gráfica diaria (`getDailySalesTotals`)
 * y solo la reagrupa en memoria — ninguna consulta SQL nueva.
 */
@Injectable()
export class GetSalesWeeklyStatsUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(): Promise<SalesWeeklyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, daysInMonth, 23, 59, 59, 999);

    const rows = await this.saleRepository.getDailySalesTotals(startDate, endDate);
    const amountsByDate = new Map(rows.map((row) => [row.date, row.amount]));

    const weeks: SalesWeeklyStatOutput[] = [];
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

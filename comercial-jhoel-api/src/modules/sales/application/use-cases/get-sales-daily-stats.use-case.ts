import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';

export interface SalesDailyStatOutput {
  /** `yyyy-MM-dd` */
  date: string;
  amount: number;
}

export interface SalesDailyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  /** One entry per calendar day of the current month, 1st through the last — a day with no CONFIRMED/non-voided sale is `amount: 0`, never omitted. */
  days: SalesDailyStatOutput[];
}

/**
 * "Ventas del mes" — Gráficas → Indicadores de Ventas. Monto total vendido
 * (`SUM(total)`), no cantidad de ventas — mismo criterio ya confirmado para
 * el módulo de Transacciones, aplicado aquí a dinero en vez de conteo.
 * Siempre el mes actual del servidor (`America/Guatemala`), nunca una fecha
 * del navegador. Excluye ventas `OPEN` (borradores) y anuladas —
 * `getDailySalesTotals` ya filtra `status = 'CONFIRMED' AND is_voided = false`.
 */
@Injectable()
export class GetSalesDailyStatsUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(): Promise<SalesDailyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, daysInMonth, 23, 59, 59, 999);

    const rows = await this.saleRepository.getDailySalesTotals(startDate, endDate);
    const amountsByDate = new Map(rows.map((row) => [row.date, row.amount]));

    const days: SalesDailyStatOutput[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      days.push({ date, amount: amountsByDate.get(date) ?? 0 });
    }

    return { month: monthPrefix, days };
  }
}

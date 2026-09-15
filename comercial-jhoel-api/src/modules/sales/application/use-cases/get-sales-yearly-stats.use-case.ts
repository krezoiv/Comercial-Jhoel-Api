import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';

const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export interface SalesMonthlyStatOutput {
  /** `yyyy-MM` */
  month: string;
  label: string;
  amount: number;
}

export interface SalesYearlyStatsOutput {
  year: number;
  /** Enero hasta el mes actual — nunca se reinicia dentro del año, un mes ya transcurrido permanece aunque tenga `amount: 0`. */
  months: SalesMonthlyStatOutput[];
}

/**
 * "Ventas por mes" — acumulativo, enero hasta el mes actual del año en
 * curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
 * Una sola consulta agregada (`getMonthlySalesTotals`), mismo patrón que
 * `GetBankDepositYearlyStatsUseCase`.
 */
@Injectable()
export class GetSalesYearlyStatsUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(): Promise<SalesYearlyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(year, currentMonthIndex, now.getDate(), 23, 59, 59, 999);

    const rows = await this.saleRepository.getMonthlySalesTotals(startDate, endDate);
    const amountsByMonth = new Map(rows.map((row) => [row.month, row.amount]));

    const months: SalesMonthlyStatOutput[] = [];
    for (let m = 0; m <= currentMonthIndex; m++) {
      const monthKey = `${year}-${String(m + 1).padStart(2, '0')}`;
      months.push({
        month: monthKey,
        label: MONTH_LABELS[m],
        amount: amountsByMonth.get(monthKey) ?? 0,
      });
    }

    return { year, months };
  }
}

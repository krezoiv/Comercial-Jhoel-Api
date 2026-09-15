import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';

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

export interface PurchasesMonthlyStatOutput {
  /** `yyyy-MM` */
  month: string;
  label: string;
  amount: number;
}

export interface PurchasesYearlyStatsOutput {
  year: number;
  /** Enero hasta el mes actual — nunca se reinicia dentro del año. */
  months: PurchasesMonthlyStatOutput[];
}

/**
 * "Compras por mes" — acumulativo, enero hasta el mes actual del año en
 * curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
 * Una sola consulta agregada (`getMonthlyPurchaseTotals`).
 */
@Injectable()
export class GetPurchasesYearlyStatsUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(): Promise<PurchasesYearlyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(year, currentMonthIndex, now.getDate(), 23, 59, 59, 999);

    const rows = await this.purchaseRepository.getMonthlyPurchaseTotals(startDate, endDate);
    const amountsByMonth = new Map(rows.map((row) => [row.month, row.amount]));

    const months: PurchasesMonthlyStatOutput[] = [];
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

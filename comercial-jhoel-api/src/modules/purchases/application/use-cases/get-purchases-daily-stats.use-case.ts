import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';

export interface PurchasesDailyStatOutput {
  /** `yyyy-MM-dd` */
  date: string;
  amount: number;
}

export interface PurchasesDailyStatsOutput {
  /** `yyyy-MM` */
  month: string;
  /** One entry per calendar day of the current month — a day with no non-voided purchase is `amount: 0`, never omitted. */
  days: PurchasesDailyStatOutput[];
}

/**
 * "Compras del mes" — Gráficas → Indicadores de Compras. Monto total
 * comprado (`SUM(total)`), no cantidad de compras — mismo criterio ya
 * confirmado para Ventas/Transacciones. Siempre el mes actual del
 * servidor. Excluye compras anuladas (`getDailyPurchaseTotals` ya filtra
 * `is_voided = false`).
 */
@Injectable()
export class GetPurchasesDailyStatsUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(): Promise<PurchasesDailyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, daysInMonth, 23, 59, 59, 999);

    const rows = await this.purchaseRepository.getDailyPurchaseTotals(startDate, endDate);
    const amountsByDate = new Map(rows.map((row) => [row.date, row.amount]));

    const days: PurchasesDailyStatOutput[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      days.push({ date, amount: amountsByDate.get(date) ?? 0 });
    }

    return { month: monthPrefix, days };
  }
}

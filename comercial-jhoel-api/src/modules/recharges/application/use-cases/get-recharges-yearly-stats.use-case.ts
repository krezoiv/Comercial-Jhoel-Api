import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from '../../domain/repositories/recharge-daily-balance.repository';
import type { RechargeDailyBalanceRepository } from '../../domain/repositories/recharge-daily-balance.repository';

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

export interface RechargesMonthlyStatOutput {
  /** `yyyy-MM` */
  month: string;
  label: string;
  amount: number;
}

export interface RechargesYearlyStatsOutput {
  year: number;
  /** Enero hasta el mes actual — nunca se reinicia dentro del año. */
  months: RechargesMonthlyStatOutput[];
}

/** Local-time `yyyy-MM-dd` — small per-feature copy of the same helper already duplicated across this module. */
function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * "Recargas por mes" — acumulativo, enero hasta el mes actual del año en
 * curso, a diferencia de la gráfica diaria/semanal de este mismo módulo.
 * Una sola consulta agregada (`getMonthlySalesTotals`).
 */
@Injectable()
export class GetRechargesYearlyStatsUseCase {
  constructor(
    @Inject(RECHARGE_DAILY_BALANCE_REPOSITORY)
    private readonly rechargeDailyBalanceRepository: RechargeDailyBalanceRepository,
  ) {}

  async execute(): Promise<RechargesYearlyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const startDate = `${year}-01-01`;
    const endDate = todayIsoDate();

    const rows = await this.rechargeDailyBalanceRepository.getMonthlySalesTotals(startDate, endDate);
    const amountsByMonth = new Map(rows.map((row) => [row.month, row.amount]));

    const months: RechargesMonthlyStatOutput[] = [];
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

import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { todayIsoDate } from '../utils/today-iso-date';

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

export interface BankDepositMonthlyStatOutput {
  /** `yyyy-MM` */
  month: string;
  /** Spanish month name, e.g. "Septiembre". */
  label: string;
  transactionCount: number;
}

export interface BankDepositYearlyStatsOutput {
  year: number;
  /** One entry per month from January through the current month — unlike the daily/weekly charts, this never resets: a month that already elapsed stays in the list (even at 0) for as long as the year is current. */
  months: BankDepositMonthlyStatOutput[];
}

/**
 * "Transacciones por mes" — enero hasta el mes actual del año en curso,
 * acumulativo, nunca se reinicia dentro del año (a diferencia de las
 * gráficas diaria/semanal, ver `GetBankDepositDailyStatsUseCase`/
 * `GetBankDepositWeeklyStatsUseCase`). Un mes ya transcurrido permanece en
 * la lista aunque haya tenido 0 transacciones — nunca se oculta.
 *
 * Una sola consulta agregada nueva
 * (`BankDepositRepository.getMonthlyTransactionCounts`, `GROUP BY
 * to_char(operation_date, 'YYYY-MM')`), mismo patrón exacto que
 * `getDailyTransactionCounts` ya establece en este módulo — nunca una
 * consulta por mes.
 */
@Injectable()
export class GetBankDepositYearlyStatsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositYearlyStatsOutput> {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const startDate = `${year}-01-01`;
    const endDate = todayIsoDate();

    const rows = await this.bankDepositRepository.getMonthlyTransactionCounts(startDate, endDate);
    const countsByMonth = new Map(rows.map((row) => [row.month, row.transactionCount]));

    const months: BankDepositMonthlyStatOutput[] = [];
    for (let m = 0; m <= currentMonthIndex; m++) {
      const monthKey = `${year}-${String(m + 1).padStart(2, '0')}`;
      months.push({
        month: monthKey,
        label: MONTH_LABELS[m],
        transactionCount: countsByMonth.get(monthKey) ?? 0,
      });
    }

    return { year, months };
  }
}

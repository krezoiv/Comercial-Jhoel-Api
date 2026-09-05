import {
  BankTransactionRow,
  DailyAmountRow,
} from '../../domain/repositories/dashboard.repository';

export interface DashboardPeriodOutput {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

export interface DashboardDayOutput {
  date: string;
  amount: number;
}

export interface DashboardDailySeriesOutput {
  highestDay: DashboardDayOutput | null;
  lowestDay: DashboardDayOutput | null;
  total: number;
}

export interface DashboardBankOutput {
  bankId: string;
  bankName: string;
  transactions: number;
}

export interface DashboardBankTransactionsOutput {
  totalTransactions: number;
  highestBank: DashboardBankOutput | null;
  lowestBank: DashboardBankOutput | null;
}

export interface DashboardSummaryOutput {
  period: DashboardPeriodOutput;
  rechargeSales: DashboardDailySeriesOutput;
  sales: DashboardDailySeriesOutput;
  purchases: { total: number };
  bankTransactions: DashboardBankTransactionsOutput;
}

/**
 * Empates — fecha: el día más reciente gana, tanto para el máximo como para
 * el mínimo (regla explícita del ticket). Se resuelve ordenando por
 * (amount, date) y tomando el primer/último elemento — nunca el primer
 * `Array.prototype.find` con un empate ambiguo.
 */
export function summarizeDailySeries(
  rows: DailyAmountRow[],
): DashboardDailySeriesOutput {
  if (rows.length === 0) {
    return { highestDay: null, lowestDay: null, total: 0 };
  }

  const sorted = [...rows].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return 0;
  });

  const highest = sorted.reduce((best, row) => {
    if (row.amount > best.amount) return row;
    if (row.amount === best.amount && row.date > best.date) return row;
    return best;
  });
  const lowest = sorted.reduce((best, row) => {
    if (row.amount < best.amount) return row;
    if (row.amount === best.amount && row.date > best.date) return row;
    return best;
  });
  const total = round2(rows.reduce((sum, row) => sum + row.amount, 0));

  return {
    highestDay: { date: highest.date, amount: round2(highest.amount) },
    lowestDay: { date: lowest.date, amount: round2(lowest.amount) },
    total,
  };
}

/**
 * Empates — banco: el nombre alfabéticamente primero gana (A→Z), tanto para
 * el máximo como para el mínimo — la misma regla determinista aplicada de
 * forma consistente en ambos sentidos, ya que un banco no tiene un
 * equivalente natural a "el más reciente" (a diferencia de un día).
 */
export function summarizeBankTransactions(
  rows: BankTransactionRow[],
): DashboardBankTransactionsOutput {
  const totalTransactions = rows.reduce(
    (sum, row) => sum + row.transactions,
    0,
  );

  if (rows.length === 0) {
    return { totalTransactions, highestBank: null, lowestBank: null };
  }

  const highest = rows.reduce((best, row) => {
    if (row.transactions > best.transactions) return row;
    if (row.transactions === best.transactions && row.bankName < best.bankName)
      return row;
    return best;
  });
  const lowest = rows.reduce((best, row) => {
    if (row.transactions < best.transactions) return row;
    if (row.transactions === best.transactions && row.bankName < best.bankName)
      return row;
    return best;
  });

  return {
    totalTransactions,
    highestBank: {
      bankId: highest.bankId,
      bankName: highest.bankName,
      transactions: highest.transactions,
    },
    lowestBank: {
      bankId: lowest.bankId,
      bankName: lowest.bankName,
      transactions: lowest.transactions,
    },
  };
}

/** Avoids a float artifact (e.g. `6500.000000000001`) when summing `numeric` values that already round-tripped through JS floats via `parseFloat`. */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

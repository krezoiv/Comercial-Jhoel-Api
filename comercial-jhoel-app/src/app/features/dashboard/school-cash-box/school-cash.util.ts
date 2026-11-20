export {
  cashCountsToDetails,
  cashCountsTotal,
  emptyCashCounts,
  formatGuatemalaDateTime,
  formatIsoDate,
  guatemalaToday,
  round2,
} from '../guayacan-cash-box/guayacan-cash.util';
export { formatCurrency } from '../../../core/utils/number-format.util';

/** First day of the current Guatemala month (`yyyy-MM-01`). */
export function monthStart(today: string): string {
  return `${today.slice(0, 8)}01`;
}

/** `+Q 1.00` / `−Q 1.00` for a signed cash effect, `—` for none. */
export function signedMoney(value: number, format: (value: number) => string): string {
  if (value === 0) {
    return '—';
  }
  return `${value > 0 ? '+' : '−'}${format(Math.abs(value))}`;
}

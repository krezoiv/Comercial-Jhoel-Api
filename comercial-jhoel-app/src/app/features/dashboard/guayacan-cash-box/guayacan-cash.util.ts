import { BANK_DEPOSIT_CASH_DENOMINATIONS, GuayacanCashDenomination } from '../../../core/models';
import { CuadreStatus } from '../../../core/services/bank-deposit-draft.store';
import { formatSignedBankBalance } from '../../../core/utils/bank-balance.util';

/** Mismas 11 denominaciones de Transaccionar (y de la validación SQL de la caja). */
export const GUAYACAN_DENOMINATIONS = BANK_DEPOSIT_CASH_DENOMINATIONS;

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function emptyCashCounts(): Record<string, number> {
  return Object.fromEntries(GUAYACAN_DENOMINATIONS.map((d) => [String(d), 0]));
}

export function cashCountsTotal(counts: Record<string, number>): number {
  return round2(GUAYACAN_DENOMINATIONS.reduce((sum, d) => sum + d * (counts[String(d)] || 0), 0));
}

/** Filas con cantidad > 0 (movimiento) o todas (arqueo), en el formato del API. */
export function cashCountsToDetails(
  counts: Record<string, number>,
  options: { keepZero: boolean },
): GuayacanCashDenomination[] {
  return GUAYACAN_DENOMINATIONS.map((denomination) => ({
    denomination,
    quantity: counts[String(denomination)] || 0,
  })).filter((row) => options.keepZero || row.quantity > 0);
}

/** Verde = cuadra con el objetivo, rojo = excede, amarillo = falta (mismo código de colores de Transaccionar). */
export function cashStatus(total: number, target: number): CuadreStatus {
  const counted = round2(total);
  const expected = round2(target);
  if (counted === expected && expected > 0) return 'green';
  return counted > expected ? 'red' : 'yellow';
}

/** `yyyy-MM-dd` de hoy en Guatemala, independientemente de la zona del navegador. */
export function guatemalaToday(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** `dd/MM/yyyy` de una fecha `yyyy-MM-dd` sin pasar por `Date` (sin desfase de zona). */
export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

/** `dd/MM/yyyy HH:mm` en Guatemala de un instante del servidor (`es-GT` no rellena el día, así que se arma a mano). */
export function formatGuatemalaDateTime(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const get = (type: string) => (parts.find((part) => part.type === type)?.value ?? '').padStart(2, '0');
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}

/** Diferencia de arqueo con signo explícito: "+Q 25.00", "-Q 50.00", "Q 0.00". */
export function formatDifference(value: number): string {
  return value > 0 ? `+${formatSignedBankBalance(value)}` : formatSignedBankBalance(value);
}

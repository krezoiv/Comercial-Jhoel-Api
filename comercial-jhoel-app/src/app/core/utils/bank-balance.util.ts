import { formatCurrency } from './number-format.util';

/**
 * Formato de un saldo bancario CONSERVANDO su signo real: `-5000` →
 * `"-Q 5,000.00"`, nunca `"Q 5,000.00"`. El valor numérico nunca se
 * transforma — solo cambia dónde se dibuja el signo (delante de la "Q").
 */
export function formatSignedBankBalance(value: number): string {
  return value < 0 ? `-${formatCurrency(-value)}` : formatCurrency(value);
}

/** Un saldo negativo de la línea de crédito de Génesis se muestra como "Saldo a favor" (sin ocultar el signo). */
export function isFavorBalance(specialAccount: string | null | undefined, value: number): boolean {
  return specialAccount === 'GENESIS' && value < 0;
}

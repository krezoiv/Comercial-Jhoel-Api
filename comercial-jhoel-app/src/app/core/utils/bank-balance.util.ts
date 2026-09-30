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

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * BI Club Empresarial es una LÍNEA DE CRÉDITO (migración backend
 * `BiClubCreditLine`): su saldo va de Q0.00 (nada utilizado) a
 * `-maxBalance` (línea agotada). Todo lo de abajo es solo UX — el backend
 * (`apply_bank_account_movement`) vuelve a validar bajo lock.
 */
export function isCreditLineAccount(specialAccount: string | null | undefined): boolean {
  return specialAccount === 'BI_CLUB';
}

export interface CreditLineStatus {
  /** `banks.max_balance` — la única fuente del límite (Sistema → Bancos). */
  limit: number;
  /** Saldo real con su signo (≤ 0). */
  balance: number;
  /** Monto utilizado / adeudado = −saldo (el saldo guardado nunca se transforma). */
  used: number;
  /** Disponible = límite + saldo. */
  available: number;
}

export function creditLineStatus(balance: number, maxBalance: number | null): CreditLineStatus {
  const limit = maxBalance ?? 0;
  return {
    limit,
    balance,
    used: balance < 0 ? round2(-balance) : 0,
    available: round2(limit + balance),
  };
}

/**
 * Cuánto cambia el saldo de una cuenta en una transferencia: el origen
 * resta y el destino suma, también BI Club (usar la línea = enviar a Banco
 * Industrial; pagarla = recibir de Banco Industrial). Lo especial de BI Club
 * son solo sus límites (`creditLineMovementError`).
 */
export function transferBalanceDelta(side: 'source' | 'destination', amount: number): number {
  return side === 'source' ? -amount : amount;
}

/** Mensajes idénticos a los del backend (`bank-movement.errors.ts`). */
export const CREDIT_LINE_LIMIT_MESSAGE =
  'El monto excede el límite disponible de la línea de crédito de BI Club Empresarial.';
export const CREDIT_LINE_NO_DEBT_MESSAGE = 'No existe saldo pendiente para realizar esta devolución.';
export const CREDIT_LINE_OVERPAYMENT_MESSAGE =
  'El monto de devolución excede el saldo pendiente de la línea de crédito.';

/** Valida un movimiento (`delta` con signo) sobre la línea de crédito: `-límite ≤ saldo ≤ 0`. */
export function creditLineMovementError(before: number, delta: number, maxBalance: number | null): string | null {
  const after = round2(before + delta);
  if (delta < 0 && after < -(maxBalance ?? 0)) {
    return CREDIT_LINE_LIMIT_MESSAGE;
  }
  if (delta > 0 && after > 0) {
    return before >= 0 ? CREDIT_LINE_NO_DEBT_MESSAGE : CREDIT_LINE_OVERPAYMENT_MESSAGE;
  }
  return null;
}

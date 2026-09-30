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
 * `BiClubAvailableCredit`): su saldo es el DISPONIBLE con signo negativo —
 * `-maxBalance` = todo disponible, Q0.00 = línea agotada. Todo lo de abajo es
 * solo UX: el backend (`apply_bank_account_movement`) vuelve a validar bajo lock.
 */
export function isCreditLineAccount(specialAccount: string | null | undefined): boolean {
  return specialAccount === 'BI_CLUB';
}

export interface CreditLineStatus {
  /** `banks.max_balance` — la única fuente del límite (Sistema → Bancos). */
  limit: number;
  /** Saldo real con su signo (≤ 0). */
  balance: number;
  /** Utilizado = límite + saldo. */
  used: number;
  /** Disponible = −saldo (solo para mostrar; el saldo guardado nunca se transforma). */
  available: number;
}

export function creditLineStatus(balance: number, maxBalance: number | null): CreditLineStatus {
  const limit = maxBalance ?? 0;
  return {
    limit,
    balance,
    used: Math.max(round2(limit + balance), 0),
    available: balance < 0 ? round2(-balance) : 0,
  };
}

/**
 * Efecto real sobre el saldo de un movimiento operativo (`normalDelta` = lo
 * que haría en una cuenta normal). BI Club lo invierte: enviar/depositar
 * consume disponible (el saldo SUBE hacia 0); recibir/acreditar lo repone
 * (BAJA hacia −límite). Espejo de `apply_bank_account_movement`.
 */
export function balanceEffect(specialAccount: string | null | undefined, normalDelta: number): number {
  return isCreditLineAccount(specialAccount) ? -normalDelta : normalDelta;
}

/** Cuánto cambia el saldo de una cuenta en una transferencia (origen o destino). */
export function transferBalanceDelta(
  specialAccount: string | null | undefined,
  side: 'source' | 'destination',
  amount: number,
): number {
  return balanceEffect(specialAccount, side === 'source' ? -amount : amount);
}

/** Mensajes idénticos a los del backend (`bank-movement.errors.ts`). */
export const CREDIT_LINE_NO_AVAILABLE_MESSAGE =
  'La línea de crédito de BI Club Empresarial no tiene disponible (saldo Q0.00).';
export const CREDIT_LINE_AVAILABLE_EXCEEDED_MESSAGE =
  'El monto excede el disponible de la línea de crédito de BI Club Empresarial.';
export const CREDIT_LINE_PAYMENT_EXCEEDED_MESSAGE =
  'El pago excede el monto utilizado de la línea de crédito de BI Club Empresarial.';

/** Valida un movimiento (`delta` = efecto real con signo) sobre la línea: `-límite ≤ saldo ≤ 0`. */
export function creditLineMovementError(before: number, delta: number, maxBalance: number | null): string | null {
  const after = round2(before + delta);
  if (delta > 0 && after > 0) {
    return before >= 0
      ? CREDIT_LINE_NO_AVAILABLE_MESSAGE
      : `${CREDIT_LINE_AVAILABLE_EXCEEDED_MESSAGE} Disponible: ${formatCurrency(-before)}.`;
  }
  if (delta < 0 && after < -(maxBalance ?? 0)) {
    return CREDIT_LINE_PAYMENT_EXCEEDED_MESSAGE;
  }
  return null;
}

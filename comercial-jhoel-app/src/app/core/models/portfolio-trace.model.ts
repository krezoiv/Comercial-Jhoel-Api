import { formatCurrency } from '../utils/number-format.util';

/**
 * Cuentas por Cobrar / Activos ↔ Caja (backend migration 1760009300000). Every
 * figure comes from the backend (`GET /<module>/:id/trace` and the client
 * statement); Angular only labels it — the cash rule itself lives in one SQL
 * function (`portfolio_row_cash_effect`).
 */
export type PortfolioPaymentMethod = 'EFECTIVO' | 'BANCO';

export const PAYMENT_METHOD_LABEL: Record<PortfolioPaymentMethod, string> = {
  EFECTIVO: 'Efectivo',
  BANCO: 'Banco / transferencia',
};

export interface PortfolioCashMovement {
  id: string;
  sequence: number;
  movementType: string;
  direction: 'IN' | 'OUT' | 'NONE';
  amount: number;
  status: 'VIGENTE' | 'ANULADO';
  reason: string | null;
  reversalOfId: string | null;
  createdAt: string;
  username: string;
}

export interface PortfolioFieldChange {
  from: unknown;
  to: unknown;
}

export interface PortfolioRecordChange {
  id: string;
  action: 'MODIFICADO' | 'ANULADO';
  reason: string | null;
  changes: Record<string, PortfolioFieldChange>;
  cashTracked: boolean;
  cashEffectBefore: number | null;
  cashEffectAfter: number | null;
  cashMovementIds: string[];
  changedByUsername: string;
  changedAt: string;
}

export interface PortfolioRecordTrace {
  recordId: string;
  isActive: boolean;
  paymentMethod: PortfolioPaymentMethod;
  /** False = registered before Control de Efectivo: its changes never move Caja. */
  cashTracked: boolean;
  /** Signed effect the record must have in Caja now (+ entra, − sale); null when not tracked. */
  cashEffect: number | null;
  kardexNet: number;
  lock: 'BANK_DEPOSIT' | 'AR_PAYMENT' | null;
  operationId: string | null;
  voided: { at: string; byUsername: string | null; reason: string | null } | null;
  movements: PortfolioCashMovement[];
  changes: PortfolioRecordChange[];
}

/** Kardex number as the Estado de Cuenta de Efectivo shows it. */
export function movementNumber(sequence: number): string {
  return `MOV-${String(sequence).padStart(6, '0')}`;
}

/** "Entrada de Q100.00" / "Salida de Q100.00" / "No mueve Caja" for a signed effect. */
export function cashEffectText(effect: number | null): string {
  if (effect === null || effect === 0) {
    return 'No mueve Caja';
  }
  return `${effect > 0 ? 'Entrada' : 'Salida'} de ${formatCurrency(Math.abs(effect))}`;
}

/** Same, for the middle of a sentence ("entrada de Q100.00"). */
export function cashEffectPhrase(effect: number | null): string {
  const text = cashEffectText(effect);
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * What happens to Caja when the record is voided, in words — from the
 * backend's trace (the reversal is exactly the opposite of what the Kardex
 * holds for it).
 */
export function voidCashNote(trace: PortfolioRecordTrace): string {
  if (!trace.cashTracked) {
    return 'Registro anterior al Control de Efectivo: su efectivo ya estaba en el saldo inicial contado, anularlo no mueve Caja.';
  }
  if (trace.kardexNet === 0) {
    return trace.paymentMethod === 'BANCO'
      ? 'Se registró por banco: anularlo no mueve Caja.'
      : 'No tiene efecto vigente en Caja: anularlo no mueve Caja.';
  }
  return `Caja registra la reversa: ${cashEffectPhrase(-trace.kardexNet)} (vinculada al movimiento original, con su motivo).`;
}

const FIELD_LABEL: Record<string, string> = {
  amount: 'Monto',
  movementType: 'Tipo',
  paymentMethod: 'Medio',
  client: 'Cliente',
  date: 'Fecha',
  description: 'Descripción',
  isActive: 'Estado',
};

function fieldValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (field === 'amount') {
    return formatCurrency(Number(value));
  }
  if (field === 'paymentMethod') {
    return PAYMENT_METHOD_LABEL[value as PortfolioPaymentMethod] ?? String(value);
  }
  if (field === 'isActive') {
    return value ? 'Vigente' : 'Anulado';
  }
  if (field === 'date') {
    const [y, m, d] = String(value).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  }
  return String(value);
}

/** "Monto: Q150.00 → Q180.00" lines of one change (the voiding itself is the action, not a line). */
export function changeLines(change: PortfolioRecordChange): string[] {
  return Object.entries(change.changes)
    .filter(([field]) => field !== 'isActive')
    .map(
      ([field, value]) =>
        `${FIELD_LABEL[field] ?? field}: ${fieldValue(field, value.from)} → ${fieldValue(field, value.to)}`,
    );
}

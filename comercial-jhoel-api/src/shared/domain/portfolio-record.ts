import { DomainError } from './domain-error';

/**
 * Shared kernel of Cuentas por Cobrar and Activos (migration
 * `1760009300000-PortfolioCashTraceability`). Both modules keep their own
 * tables and balances; what they share is how a record relates to the physical
 * cash (the Caja Kardex) and how its changes are audited:
 *
 * - `paymentMethod`: EFECTIVO moves Caja, BANCO never does. `null` = registered
 *   before the column existed (behaves as EFECTIVO; a Cartera collection takes
 *   its operation's method).
 * - Every change that alters the cash effect (amount, type, active, payment
 *   method) needs a reason; the database enforces it
 *   (`portfolio_row_change_guard`) and reverses + re-applies the Kardex
 *   movements with that reason, linked to the originals.
 * - Every change is appended to `portfolio_record_changes` (before → after).
 *
 * The cash rule itself lives in ONE place, `portfolio_row_cash_effect` (SQL),
 * used by the triggers and by the cash audit; nothing here recomputes it.
 */
export type PortfolioPaymentMethod = 'EFECTIVO' | 'BANCO';
export const PORTFOLIO_PAYMENT_METHODS: readonly PortfolioPaymentMethod[] = [
  'EFECTIVO',
  'BANCO',
];

export type PortfolioRecordType = 'ACCOUNT_RECEIVABLE' | 'ASSET';
export type PortfolioTable = 'accounts_receivable' | 'assets';

export const MIN_CHANGE_REASON_LENGTH = 5;
export const MAX_CHANGE_REASON_LENGTH = 255;

/** One Kardex movement of a record (original, reversal or re-applied effect). */
export interface PortfolioCashMovement {
  id: string;
  sequence: number;
  movementType: string;
  direction: 'IN' | 'OUT' | 'NONE';
  amount: number;
  status: 'VIGENTE' | 'ANULADO';
  reason: string | null;
  reversalOfId: string | null;
  createdAt: Date;
  username: string;
}

export interface PortfolioFieldChange {
  from: unknown;
  to: unknown;
}

/** One entry of `portfolio_record_changes`. */
export interface PortfolioRecordChange {
  id: string;
  action: 'MODIFICADO' | 'ANULADO';
  reason: string | null;
  changes: Record<string, PortfolioFieldChange>;
  cashTracked: boolean;
  /** Signed expected Caja effect before/after (null when the record is not tracked). */
  cashEffectBefore: number | null;
  cashEffectAfter: number | null;
  cashMovementIds: string[];
  changedByUsername: string;
  changedAt: Date;
}

/** Why a record cannot be changed freely (null = it can, with a reason when the cash effect changes). */
export type PortfolioRecordLock = 'BANK_DEPOSIT' | 'AR_PAYMENT' | null;

/** Everything the backend knows about a record and the physical cash, for the UI to show (never to recompute). */
export interface PortfolioRecordTrace {
  recordId: string;
  isActive: boolean;
  /** EFECTIVO | BANCO; for a Cartera collection, the method of its operation. */
  paymentMethod: PortfolioPaymentMethod;
  /** False = registered before Control de Efectivo: its changes never move Caja. */
  cashTracked: boolean;
  /** Signed effect the record must have in Caja now (rule), null when not tracked. */
  cashEffect: number | null;
  /** Signed net of its Kardex movements (should equal `cashEffect`). */
  kardexNet: number;
  lock: PortfolioRecordLock;
  /** Transaccionar operation it was born from (when `lock` = BANK_DEPOSIT). */
  operationId: string | null;
  voided: { at: Date; byUsername: string | null; reason: string | null } | null;
  movements: PortfolioCashMovement[];
  changes: PortfolioRecordChange[];
}

export interface PortfolioStatementMovement {
  id: string;
  date: string;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  amount: number;
  /** Running balance of ACTIVE rows; null for a voided row (it no longer counts). */
  balanceAfter: number | null;
  isActive: boolean;
  createdByUsername: string;
  createdAt: Date;
  trace: PortfolioRecordTrace;
}

export interface PortfolioStatement {
  clientId: string;
  clientName: string;
  openingBalance: number;
  movements: PortfolioStatementMovement[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
  voidedCount: number;
}

export interface PortfolioStatementOptions {
  dateFrom?: string;
  dateTo?: string;
  /** Voided rows stay visible (struck through, with their reason) unless false. */
  includeVoided?: boolean;
}

export interface PortfolioCurrentValues {
  amount: number;
  paymentMethod: PortfolioPaymentMethod | null;
}

export interface PortfolioRequestedChange {
  amount?: number;
  paymentMethod?: PortfolioPaymentMethod;
}

/** True when the change alters the record's cash effect (amount or payment method) — a reason is then mandatory. */
export function changesCashEffect(
  current: PortfolioCurrentValues,
  change: PortfolioRequestedChange,
): boolean {
  const amountChanges =
    change.amount !== undefined &&
    Math.round(change.amount * 100) !== Math.round(current.amount * 100);
  const methodChanges =
    change.paymentMethod !== undefined &&
    change.paymentMethod !== (current.paymentMethod ?? 'EFECTIVO');
  return amountChanges || methodChanges;
}

/** Trimmed reason, or throws `PORTFOLIO_CHANGE_REASON_REQUIRED`. */
export function requireChangeReason(reason: string | null | undefined): string {
  const trimmed = (reason ?? '').trim().replace(/\s+/g, ' ');
  if (trimmed.length < MIN_CHANGE_REASON_LENGTH) {
    throw portfolioRecordError('PORTFOLIO_CHANGE_REASON_REQUIRED');
  }
  return trimmed.slice(0, MAX_CHANGE_REASON_LENGTH);
}

export class PortfolioRecordError extends DomainError {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, { message: string; status?: number }> = {
  PORTFOLIO_CHANGE_REASON_REQUIRED: {
    message:
      'Indique el motivo (mínimo 5 caracteres): queda en el historial del registro y en la reversa de Caja.',
  },
  PORTFOLIO_RECORD_NOT_FOUND: {
    message: 'No se encontró el registro.',
    status: 404,
  },
  PORTFOLIO_RECORD_VOIDED: {
    message: 'El registro está anulado: es historial y no se puede modificar.',
    status: 409,
  },
  PORTFOLIO_RECORD_ALREADY_VOIDED: {
    message: 'El registro ya fue anulado.',
    status: 409,
  },
  PORTFOLIO_LINKED_TO_OPERATION: {
    message:
      'Este cargo nació de una operación de Transaccionar: para eliminarlo o cambiar su monto anule la operación (se anula también el cargo). Para registrar un pago use "Registrar abono".',
    status: 409,
  },
  PORTFOLIO_INVALID_PAYMENT_METHOD: {
    message: 'Seleccione si fue en efectivo o por banco.',
  },
  PORTFOLIO_HISTORY_IMMUTABLE: {
    message: 'El historial de cambios no se puede modificar.',
    status: 409,
  },
  AR_BALANCE_WOULD_BE_NEGATIVE: {
    message:
      'El cliente tiene abonos que dependen de este cargo: su saldo quedaría negativo. Anule primero esos abonos.',
    status: 409,
  },
  BANK_DEPOSIT_LINKED_CHARGE_HAS_PAYMENTS: {
    message:
      'La operación generó un cargo en Cuentas por Cobrar que ya tiene pagos o abonos. Anule primero esos pagos y luego la operación.',
    status: 409,
  },
};

export function portfolioRecordError(code: string): PortfolioRecordError {
  const entry = MESSAGES[code];
  return new PortfolioRecordError(code, entry.message, entry.status);
}

/** Maps a `RAISE '<CODE>:<detail>'` of the portfolio functions/triggers, or null when it is not one of them. */
export function portfolioRecordErrorFromMessage(
  message: string,
): PortfolioRecordError | null {
  const code = message.split(':')[0].trim();
  return MESSAGES[code] ? portfolioRecordError(code) : null;
}

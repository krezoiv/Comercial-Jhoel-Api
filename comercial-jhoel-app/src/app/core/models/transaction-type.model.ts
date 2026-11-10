/**
 * Curated subset of the shared icon registry — mirrors the backend's own
 * `TRANSACTION_TYPE_ICONS` whitelist exactly (`transaction-types` module,
 * `domain/entities/transaction-type.entity.ts`). Kept in sync by hand: this
 * is the one icon picker in the app, not worth a shared package for.
 */
export const TRANSACTION_TYPE_ICONS = [
  'bank',
  'arrow-down-circle',
  'arrow-up-circle',
  'arrow-left-right',
  'credit-card',
  'wallet',
  'receipt',
  'file-check',
  'briefcase',
  'trending-up',
  'package',
  'check-circle',
  'refresh-cw',
  'shopping-bag',
] as const;

export type TransactionTypeIcon = (typeof TRANSACTION_TYPE_ICONS)[number];

/** "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago Cheque, etc. Selected on Transaccionar's own dashboard before a deposit registration begins. */
export interface TransactionType {
  id: string;
  name: string;
  icon: string;
  /** Efecto sobre el saldo bancario — `null` = no mueve saldo (Remesas, Pago de Cheque...). */
  balanceEffect: TransactionTypeBalanceEffect | null;
  /** Efecto sobre el EFECTIVO FÍSICO (Control de Efectivo) — independiente del efecto bancario. */
  cashEffect: TransactionTypeCashEffect;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps. */
export interface TransactionTypeInput {
  name: string;
  icon: string;
  balanceEffect?: TransactionTypeBalanceEffect | null;
  cashEffect?: TransactionTypeCashEffect;
}

/** Espejo de `TRANSACTION_TYPE_CASH_EFFECTS` del backend: entrada, salida o sin efecto sobre el efectivo físico. */
export type TransactionTypeCashEffect = 'IN' | 'OUT' | 'NONE';

export const TRANSACTION_TYPE_CASH_EFFECT_OPTIONS: { value: TransactionTypeCashEffect; label: string; hint: string }[] = [
  { value: 'IN', label: 'Entrada de efectivo', hint: 'El cliente entrega efectivo: suma al efectivo físico disponible.' },
  { value: 'OUT', label: 'Salida de efectivo', hint: 'Se entrega efectivo desde caja: resta del efectivo físico disponible.' },
  { value: 'NONE', label: 'Sin efecto en efectivo', hint: 'No hay entrada ni salida física de dinero (p. ej. Reintegro).' },
];

/** Sugerencia al elegir el efecto bancario — la misma derivación que usa el backend si no se indica. */
export function defaultCashEffect(effect: TransactionTypeBalanceEffect | null | undefined): TransactionTypeCashEffect {
  if (effect === 'DEPOSITO' || effect === 'PAGO_GENESIS') return 'IN';
  if (effect === 'RETIRO' || effect === 'DESEMBOLSO_GENESIS') return 'OUT';
  return 'NONE';
}

/** Espejo de `TRANSACTION_TYPE_BALANCE_EFFECTS` del backend. */
export type TransactionTypeBalanceEffect = 'DEPOSITO' | 'RETIRO' | 'DESEMBOLSO_GENESIS' | 'PAGO_GENESIS' | 'REINTEGRO';

export const TRANSACTION_TYPE_BALANCE_EFFECT_OPTIONS: {
  value: TransactionTypeBalanceEffect;
  label: string;
  hint: string;
}[] = [
  { value: 'DEPOSITO', label: 'Depósito', hint: 'Resta del saldo de la cuenta seleccionada (no puede exceder el saldo).' },
  { value: 'RETIRO', label: 'Retiro', hint: 'Suma al saldo de la cuenta seleccionada.' },
  {
    value: 'DESEMBOLSO_GENESIS',
    label: 'Desembolso / Renovación Génesis',
    hint: 'Resta de la línea de crédito de Fundación Génesis (puede quedar en negativo).',
  },
  {
    value: 'PAGO_GENESIS',
    label: 'Pago de préstamo Génesis',
    hint: 'Suma a la línea de crédito de Fundación Génesis (máximo según el límite configurado).',
  },
  {
    value: 'REINTEGRO',
    label: 'Reintegro Génesis',
    hint: 'Abono a la línea de crédito: resta de la cuenta origen seleccionada y del saldo de Fundación Génesis.',
  },
];

/** Desembolsos/Pagos Génesis: sin selector de banco — la cuenta es siempre la línea de crédito de Génesis (la resuelve el backend). */
export function isGenesisBalanceEffect(effect: TransactionTypeBalanceEffect | null | undefined): boolean {
  return effect === 'DESEMBOLSO_GENESIS' || effect === 'PAGO_GENESIS';
}

/** Tipos que exigen elegir la cuenta bancaria afectada. */
export function requiresBankAccount(effect: TransactionTypeBalanceEffect | null | undefined): boolean {
  return effect === 'DEPOSITO' || effect === 'RETIRO' || effect === 'REINTEGRO';
}

/**
 * `+1` suma al saldo, `-1` resta, `0` no lo mueve — solo para la vista previa;
 * el backend recalcula siempre. Con el banco agente Cooperativa Guayacán
 * (`agentCashBoxCode = 'GUAYACAN'`) Depósito y Retiro van al revés (el
 * depósito suma, el retiro resta) — misma regla que
 * `register_bank_deposit_operation` (migración `GuayacanInvertsDepositWithdrawal`).
 */
export function balanceEffectDirection(
  effect: TransactionTypeBalanceEffect | null | undefined,
  agentCashBoxCode: string | null = null,
): 1 | -1 | 0 {
  const invert = agentCashBoxCode === 'GUAYACAN' && (effect === 'DEPOSITO' || effect === 'RETIRO');
  if (effect === 'RETIRO' || effect === 'PAGO_GENESIS') return invert ? -1 : 1;
  if (effect === 'DEPOSITO' || effect === 'DESEMBOLSO_GENESIS' || effect === 'REINTEGRO') return invert ? 1 : -1;
  return 0;
}

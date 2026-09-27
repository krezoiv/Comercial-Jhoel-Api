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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps. */
export interface TransactionTypeInput {
  name: string;
  icon: string;
  balanceEffect?: TransactionTypeBalanceEffect | null;
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
  { value: 'REINTEGRO', label: 'Reintegro', hint: 'Resta del saldo de la cuenta seleccionada.' },
];

/** Desembolsos/Pagos Génesis: sin selector de banco — la cuenta es siempre la línea de crédito de Génesis (la resuelve el backend). */
export function isGenesisBalanceEffect(effect: TransactionTypeBalanceEffect | null | undefined): boolean {
  return effect === 'DESEMBOLSO_GENESIS' || effect === 'PAGO_GENESIS';
}

/** Tipos que exigen elegir la cuenta bancaria afectada. */
export function requiresBankAccount(effect: TransactionTypeBalanceEffect | null | undefined): boolean {
  return effect === 'DEPOSITO' || effect === 'RETIRO' || effect === 'REINTEGRO';
}

/** `+1` suma al saldo, `-1` resta, `0` no lo mueve — solo para la vista previa; el backend recalcula siempre. */
export function balanceEffectDirection(effect: TransactionTypeBalanceEffect | null | undefined): 1 | -1 | 0 {
  if (effect === 'RETIRO' || effect === 'PAGO_GENESIS') return 1;
  if (effect === 'DEPOSITO' || effect === 'DESEMBOLSO_GENESIS' || effect === 'REINTEGRO') return -1;
  return 0;
}

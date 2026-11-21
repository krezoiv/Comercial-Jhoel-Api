import { TransactionType } from '../../../core/models';
import { normalizeBankName } from '../../../core/utils/transaction-bank-account.util';

/** Visual identity of an operation card — presentation only, no business rule depends on it. */
export interface TransactionTypeStyle {
  color: string;
  description: string;
}

const GREEN: TransactionTypeStyle = { color: '#16a34a', description: 'Depósito de un cliente en un banco agente.' };
const BLUE: TransactionTypeStyle = { color: '#2563eb', description: 'Desembolso o renovación de préstamo Génesis.' };
const ORANGE: TransactionTypeStyle = { color: '#ea580c', description: 'Pagos y cobros varios.' };
const VIOLET: TransactionTypeStyle = { color: '#7c3aed', description: 'Pago de préstamos Génesis.' };
const TURQUOISE: TransactionTypeStyle = { color: '#0891b2', description: 'Abono a la línea de crédito Génesis.' };
const RED: TransactionTypeStyle = { color: '#dc2626', description: 'Retiro de un cliente en un banco agente.' };

/** Other operations (Remesas, Pago de Cheque…) get a calm, distinct colour. */
const OTHER_COLORS = ['#4f46e5', '#0d9488', '#db2777', '#65a30d', '#475569'];

const BY_EFFECT: Record<NonNullable<TransactionType['balanceEffect']>, TransactionTypeStyle> = {
  DEPOSITO: GREEN,
  DESEMBOLSO_GENESIS: BLUE,
  PAGO_GENESIS: VIOLET,
  REINTEGRO: TURQUOISE,
  RETIRO: RED,
};

/** Name keywords, for types without a balance effect (or with one renamed in Sistema → Tipo de Transacción). */
const BY_NAME: Array<[RegExp, TransactionTypeStyle]> = [
  [/deposit/, GREEN],
  [/desembolso/, BLUE],
  [/prestamo/, VIOLET],
  [/reintegro/, TURQUOISE],
  [/retiro/, RED],
  [/pago/, ORANGE],
];

/**
 * Colour and one-line description of an operation card in Transaccionar:
 * Depósitos green, Desembolsos Génesis blue, Pagos Varios orange, Préstamos
 * Génesis violet, Reintegros Génesis turquoise, Retiros red. Decided by the
 * type's balance effect first (stable), then by its name.
 */
export function transactionTypeStyle(type: Pick<TransactionType, 'name' | 'balanceEffect'>): TransactionTypeStyle {
  if (type.balanceEffect) {
    return BY_EFFECT[type.balanceEffect];
  }
  const name = normalizeBankName(type.name);
  const match = BY_NAME.find(([pattern]) => pattern.test(name));
  if (match) {
    return match[1];
  }
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return { color: OTHER_COLORS[hash % OTHER_COLORS.length], description: 'Registrar la operación.' };
}

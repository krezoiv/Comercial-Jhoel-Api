import { CASH_CUT_MANAGER_ROLES, CashMovement, CashMovementBucket, CashMovementType } from '../../../core/models';

export {
  cashCountsToDetails,
  cashCountsTotal,
  emptyCashCounts,
  formatDifference,
  formatGuatemalaDateTime,
  formatIsoDate,
  guatemalaToday,
  round2,
} from '../guayacan-cash-box/guayacan-cash.util';

const GUATEMALA_TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Guatemala',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** `HH:mm` of a server instant in America/Guatemala (never the browser's zone). */
export function formatGuatemalaTime(iso: string | null | undefined): string {
  return iso ? GUATEMALA_TIME.format(new Date(iso)) : '—';
}

/** True if the role may open the day and run the cuts (UX only — the backend re-checks). */
export function canManageCuts(role: string | null | undefined): boolean {
  return CASH_CUT_MANAGER_ROLES.includes(role ?? '');
}

/** Summary cards of Control de Efectivo, in display order; everything else falls in "Otros". */
export const CASH_SUMMARY_CARDS: { key: CashMovementType; label: string; icon: string }[] = [
  { key: 'DEPOSITO', label: 'Depósitos', icon: 'arrow-down-circle' },
  { key: 'RETIRO', label: 'Retiros', icon: 'arrow-up-circle' },
  { key: 'DESEMBOLSO_GENESIS', label: 'Desembolsos Génesis', icon: 'arrow-up-circle' },
  { key: 'PAGO_GENESIS', label: 'Pagos préstamos Génesis', icon: 'arrow-down-circle' },
  { key: 'REINTEGRO', label: 'Reintegros', icon: 'rotate-ccw' },
  { key: 'GASTO_POR_COBRAR', label: 'Gastos por cobrar', icon: 'receipt' },
  { key: 'ACTIVO', label: 'Activos', icon: 'package' },
  { key: 'RETIRO_BANCARIO', label: 'Retiros bancarios a caja', icon: 'bank' },
  { key: 'DEPOSITO_BANCARIO', label: 'Depósitos bancarios', icon: 'upload' },
];

export interface CashSummaryCard {
  key: string;
  label: string;
  icon: string;
  totalIn: number;
  totalOut: number;
  count: number;
}

/** Groups the backend's per-type buckets into the summary cards (no amount is recomputed, only grouped). */
export function buildSummaryCards(buckets: CashMovementBucket[]): CashSummaryCard[] {
  const known = new Set(CASH_SUMMARY_CARDS.map((card) => card.key));
  const cards: CashSummaryCard[] = CASH_SUMMARY_CARDS.map((card) => {
    const bucket = buckets.find((row) => row.movementType === card.key);
    return { ...card, totalIn: bucket?.totalIn ?? 0, totalOut: bucket?.totalOut ?? 0, count: bucket?.count ?? 0 };
  });
  const others = buckets.filter((row) => !known.has(row.movementType));
  cards.push({
    key: 'OTROS',
    label: 'Otros movimientos',
    icon: 'layers',
    totalIn: others.reduce((sum, row) => sum + row.totalIn, 0),
    totalOut: others.reduce((sum, row) => sum + row.totalOut, 0),
    count: others.reduce((sum, row) => sum + row.count, 0),
  });
  return cards;
}

/** Gross amount of one movement type in a day (entries + exits of that type), as reported by the backend. */
export function bucketAmount(buckets: CashMovementBucket[], type: CashMovementType): number {
  const bucket = buckets.find((row) => row.movementType === type);
  return bucket ? bucket.totalIn + bucket.totalOut : 0;
}

/** Movements registered in Control de Efectivo itself — the only ones voided from here (a bank deposit reverses both sides). */
export function isManualMovement(movement: CashMovement): boolean {
  return ['ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL', 'DEPOSITO_BANCARIO'].includes(movement.movementType);
}

/** Short reference to the source operation ("BANK_DEPOSIT · 1A2B3C4D"). */
export function referenceLabel(movement: CashMovement): string {
  const labels: Record<string, string> = {
    BANK_DEPOSIT: 'Transaccionar',
    ACCOUNT_RECEIVABLE: 'Cuentas por cobrar',
    ASSET: 'Activos',
    BANK_MOVEMENT: 'Transferencias',
    BANK_CASH_DEPOSIT: 'Depósito bancario',
  };
  if (!movement.referenceType || !movement.referenceId) {
    return 'Control de Efectivo';
  }
  return `${labels[movement.referenceType] ?? movement.referenceType} · ${movement.referenceId.slice(0, 8).toUpperCase()}`;
}

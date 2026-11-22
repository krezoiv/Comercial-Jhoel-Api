/**
 * Estado de Cuenta de Efectivo — pure rules (owner request, 2026-11-21).
 *
 * The statement is a READ-ONLY view of the official Kardex (Caja:
 * `cash_movements`, Bodega: `warehouse_cash_movements`). It never stores
 * balances and never writes movements:
 *
 * - Opening balance = the Kardex balance right before the period
 *   (`cash_balance_at(start)`), i.e. exactly the closing balance of the
 *   previous period.
 * - Entries / exits = physical movements of the period (direction IN / OUT;
 *   operations without physical effect — direction NONE — are excluded).
 * - Theoretical balance = opening + entries − exits, computed here in cents and
 *   cross-checked against the Kardex closing balance: a mismatch is reported,
 *   never corrected.
 * - The physical cash comes from the arqueos of the period (Arqueo de Caja and
 *   cut counts for Caja; Arqueo de Bodega for Bodega). A count is a control,
 *   never a movement: its difference is shown, never adjusted.
 */

export type CashStatementLocation = 'CAJA' | 'BODEGA';
export const CASH_STATEMENT_LOCATIONS: readonly CashStatementLocation[] = [
  'CAJA',
  'BODEGA',
];

export type CashCountResult = 'CUADRADO' | 'FALTANTE' | 'SOBRANTE';
/** Card state: the latest count result, or SIN_ARQUEO when the period has none. */
export type CashStatementCountStatus = CashCountResult | 'SIN_ARQUEO';

/**
 * The period a statement covers.
 * - BANK_DAY (Caja): the Kardex range of one bank operational day
 *   (`cash_bank_day_ranges`, from its opening up to the next opening).
 * - RANGE / Bodega: the Kardex rows written inside a time window
 *   (Guatemala calendar dates), turned into a contiguous sequence span.
 * Rows of the period are `startSequence < sequence ≤ endSequence`
 * (`endSequence = null` = up to now).
 */
export interface CashStatementPeriod {
  kind: 'BANK_DAY' | 'RANGE';
  location: CashStatementLocation;
  /** Bank operational day (`yyyy-MM-dd`) when `kind = BANK_DAY`. */
  businessDate: string | null;
  dateFrom: string;
  dateTo: string;
  windowStart: Date;
  /** `null` while the period is still open (current bank day / range up to today). */
  windowEnd: Date | null;
  startSequence: number;
  endSequence: number | null;
  isCurrent: boolean;
  /** Agentes Bancarios status of the bank day. */
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO' | null;
  openedByUsername: string | null;
  /** Caja balance stored at the bank-day opening (only for a Caja bank day). */
  anchorOpeningBalance: number | null;
  anchorSource: 'APERTURA' | 'BACKFILL' | null;
}

export interface CashStatementLastMovement {
  id: string;
  createdAt: Date;
  movementType: string;
  direction: 'IN' | 'OUT';
  amount: number;
  description: string;
}

/** Figures of the whole period (never affected by the table filters). */
export interface CashStatementTotals {
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  movementCount: number;
  /** Kardex balance after the last movement of the period. */
  kardexClosingBalance: number;
  lastMovement: CashStatementLastMovement | null;
  /** Caja → Bodega deliveries (Caja exits) and Bodega → Caja returns (Caja entries). */
  toWarehouse: number;
  fromWarehouse: number;
}

/** One physical count shown in the statement. */
export interface CashStatementCount {
  id: string;
  source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
  number: string;
  countedAt: Date;
  /** Kardex sequence of its location at the time of the count. */
  sequence: number;
  theoretical: number;
  counted: number;
  difference: number;
  result: CashCountResult;
  status: 'VIGENTE' | 'REEMPLAZADO';
  username: string;
  observations: string | null;
}

export interface CashStatementPhysical {
  status: CashStatementCountStatus;
  count: CashStatementCount | null;
  /** Physical movements registered after that count (its theoretical is then outdated). */
  movementsAfter: number;
}

export type CashStatementWarningCode =
  | 'KARDEX_INCONSISTENT'
  | 'OPENING_ANCHOR_MISMATCH'
  | 'PREVIOUS_CLOSE_DIFFERENCE'
  | 'MOVEMENTS_AFTER_COUNT';

export interface CashStatementWarning {
  code: CashStatementWarningCode;
  tone: 'danger' | 'warning' | 'info';
  message: string;
}

export interface CashStatementSummary {
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  /** opening + entries − exits. */
  theoreticalBalance: number;
  kardexClosingBalance: number;
  /** `theoreticalBalance === kardexClosingBalance`. */
  consistent: boolean;
  movementCount: number;
  lastMovement: CashStatementLastMovement | null;
  toWarehouse: number;
  fromWarehouse: number;
  /** `null` when the user may not see physical counts. */
  physical: CashStatementPhysical | null;
}

const cents = (value: number): number => Math.round(value * 100);
const fromCents = (value: number): number => value / 100;

/** opening + entries − exits, in cents (never float drift). */
export function theoreticalBalance(
  opening: number,
  totalIn: number,
  totalOut: number,
): number {
  return fromCents(cents(opening) + cents(totalIn) - cents(totalOut));
}

/** CUADRADO / FALTANTE / SOBRANTE of a physical − theoretical difference. */
export function countResult(difference: number): CashCountResult {
  const value = cents(difference);
  return value === 0 ? 'CUADRADO' : value < 0 ? 'FALTANTE' : 'SOBRANTE';
}

/** The latest VIGENTE count of the period (by time, then by sequence). */
export function latestCount(
  counts: CashStatementCount[],
): CashStatementCount | null {
  const current = counts.filter((count) => count.status === 'VIGENTE');
  if (!current.length) {
    return null;
  }
  return current.reduce((latest, count) => {
    const a = new Date(latest.countedAt).getTime();
    const b = new Date(count.countedAt).getTime();
    return b > a || (b === a && count.sequence > latest.sequence)
      ? count
      : latest;
  });
}

function money(value: number): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}Q${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const RESULT_TEXT: Record<CashCountResult, string> = {
  CUADRADO: 'cuadrado',
  FALTANTE: 'faltante',
  SOBRANTE: 'sobrante',
};

export interface BuildCashStatementInput {
  period: CashStatementPeriod;
  totals: CashStatementTotals;
  /** `null` when the user may not see physical counts. */
  counts: CashStatementCount[] | null;
  /** Physical movements after the latest count (repository count). */
  movementsAfterLatest: number;
  /** The latest count BEFORE the period (to flag an inherited difference). */
  previousCount: CashStatementCount | null;
}

/**
 * Summary cards and warnings of a statement. Pure: everything it needs comes
 * from the Kardex and the stored counts; it only computes and compares.
 */
export function buildCashStatementSummary(input: BuildCashStatementInput): {
  summary: CashStatementSummary;
  warnings: CashStatementWarning[];
} {
  const { period, totals } = input;
  const theoretical = theoreticalBalance(
    totals.openingBalance,
    totals.totalIn,
    totals.totalOut,
  );
  const consistent = cents(theoretical) === cents(totals.kardexClosingBalance);
  const warnings: CashStatementWarning[] = [];
  const place = period.location === 'CAJA' ? 'Caja' : 'Bodega';

  if (!consistent) {
    warnings.push({
      code: 'KARDEX_INCONSISTENT',
      tone: 'danger',
      message: `El saldo calculado (${money(theoretical)}) no coincide con el último saldo del Kardex de ${place} (${money(totals.kardexClosingBalance)}). No se corrige automáticamente: revise los movimientos del período.`,
    });
  }
  if (
    period.anchorOpeningBalance !== null &&
    cents(period.anchorOpeningBalance) !== cents(totals.openingBalance)
  ) {
    warnings.push({
      code: 'OPENING_ANCHOR_MISMATCH',
      tone: 'warning',
      message: `Al aperturar el día se registró un saldo de ${money(period.anchorOpeningBalance)}, pero el Kardex indica ${money(totals.openingBalance)} al inicio del período. El estado de cuenta usa el Kardex; la apertura no se modifica.`,
    });
  }

  let physical: CashStatementPhysical | null = null;
  if (input.counts !== null) {
    const count = latestCount(input.counts);
    physical = {
      status: count ? count.result : 'SIN_ARQUEO',
      count,
      movementsAfter: count ? input.movementsAfterLatest : 0,
    };
    const previous = input.previousCount;
    if (previous && cents(previous.difference) !== 0) {
      warnings.push({
        code: 'PREVIOUS_CLOSE_DIFFERENCE',
        tone: 'warning',
        message: `El último arqueo de ${place} antes de este período (${previous.number}) terminó con ${RESULT_TEXT[previous.result]} de ${money(Math.abs(previous.difference))}. El saldo inicial es el del Kardex; esa diferencia no se arrastra ni se ajusta sola.`,
      });
    }
    if (count && input.movementsAfterLatest > 0) {
      warnings.push({
        code: 'MOVEMENTS_AFTER_COUNT',
        tone: 'info',
        message: `Hubo ${input.movementsAfterLatest} movimiento(s) después del último arqueo (${count.number}): su diferencia se calculó contra el saldo teórico de ese momento, no contra el actual.`,
      });
    }
  }

  return {
    summary: {
      openingBalance: totals.openingBalance,
      totalIn: totals.totalIn,
      totalOut: totals.totalOut,
      theoreticalBalance: theoretical,
      kardexClosingBalance: totals.kardexClosingBalance,
      consistent,
      movementCount: totals.movementCount,
      lastMovement: totals.lastMovement,
      toWarehouse: totals.toWarehouse,
      fromWarehouse: totals.fromWarehouse,
      physical,
    },
    warnings,
  };
}

/** Spanish names of the Caja and Bodega Kardex types (exports; the app keeps its own copy). */
export const CASH_STATEMENT_TYPE_LABEL: Record<string, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro de efectivo',
  DESEMBOLSO_GENESIS: 'Desembolso / renovación Génesis',
  PAGO_GENESIS: 'Pago préstamo Génesis',
  REINTEGRO: 'Reintegro',
  OTRA_TRANSACCION: 'Otra transacción',
  GASTO_POR_COBRAR: 'Gasto por cobrar',
  ABONO_POR_COBRAR: 'Abono cuenta por cobrar',
  ACTIVO: 'Activo',
  DEVOLUCION_ACTIVO: 'Devolución de activo',
  RETIRO_BANCARIO: 'Retiro bancario hacia caja',
  ENTRADA_MANUAL: 'Entrada manual',
  SALIDA_MANUAL: 'Salida manual',
  AJUSTE: 'Ajuste',
  SALDO_INICIAL: 'Saldo inicial',
  ANULACION: 'Anulación',
  DEPOSITO_BANCARIO: 'Depósito bancario',
  ENTREGA_BODEGA: 'Entrega a Bodega',
  DEVOLUCION_BODEGA: 'Devolución de Bodega',
  ENTREGA_DESDE_CAJA: 'Recibido de Caja',
  DEVOLUCION_A_CAJA: 'Devolución a Caja',
};

export const CASH_COUNT_RESULT_LABEL: Record<CashStatementCountStatus, string> =
  {
    CUADRADO: 'Cuadrado',
    FALTANTE: 'Faltante',
    SOBRANTE: 'Sobrante',
    SIN_ARQUEO: 'Sin arqueo',
  };

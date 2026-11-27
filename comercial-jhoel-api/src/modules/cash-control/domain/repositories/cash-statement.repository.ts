import type {
  CashStatementCount,
  CashStatementLocation,
  CashStatementPeriod,
  CashStatementTotals,
} from '../cash-statement';

export const CASH_STATEMENT_REPOSITORY = Symbol('CASH_STATEMENT_REPOSITORY');

/** Which period to read: one bank day, a date range, or (neither) the current bank day. */
export interface CashStatementPeriodQuery {
  location: CashStatementLocation;
  bankDate?: string;
  dateFrom?: string;
  dateTo?: string;
}

/** Filters of the movement table only — the period totals never use them. */
export interface CashStatementRowFilters {
  direction?: 'IN' | 'OUT';
  movementType?: string;
  userId?: string;
  /** Description, beneficiary, operation number or reference (accent-insensitive). */
  search?: string;
}

/**
 * One physical movement of the statement: the Kardex row plus what its source
 * operation says (beneficiary, operation number). The running balance is the
 * Kardex `new_balance` — never recomputed.
 */
export interface CashStatementRow {
  id: string;
  sequence: number;
  /** Number of the source operation (ENT-000001…) or of the Kardex row (MOV-000123). */
  operationNumber: string;
  createdAt: Date;
  movementType: string;
  /** For an ANULACION, the type it reverses. */
  originalMovementType: string | null;
  direction: 'IN' | 'OUT';
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  /** Who the money was for/from, taken from the source operation. */
  beneficiary: string | null;
  /** Bank account, counterpart or source reference. */
  reference: string | null;
  referenceType: string | null;
  referenceId: string | null;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: Date | null;
  voidReason: string | null;
  reversalOfId: string | null;
  /** Number of the original movement when this row is its reversal ("MOV-000123"). */
  reversalOfNumber: string | null;
  /** Why it was registered (manual entries, adjustments, reversals of a CxC/Activos change). */
  reason: string | null;
  username: string;
  /** Cut (1 = mediodía, 2 = final del día) the Caja movement belongs to. */
  cutPeriodNumber: number | null;
}

export interface CashStatementRowPage {
  items: CashStatementRow[];
  total: number;
  page: number;
  limit: number;
  /** Totals of the FILTERED rows (the period totals are in the summary). */
  filteredIn: number;
  filteredOut: number;
}

/** A cash cut of the period (Caja) with its official photograph. */
export interface CashStatementCut {
  id: string;
  periodNumber: number;
  status: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  cashDifference: number | null;
  closingWarehouseBalance: number | null;
  closedByUsername: string | null;
  observations: string | null;
}

/** One bank day of the statement history (Caja). */
export interface CashStatementDay {
  businessDate: string;
  isCurrent: boolean;
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO';
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  closingBalance: number;
  movementCount: number;
  /** Latest count of the day (null when there was none or the user may not see counts). */
  lastCount: Pick<
    CashStatementCount,
    'number' | 'result' | 'difference' | 'counted' | 'countedAt'
  > | null;
}

export interface CashStatementRepository {
  /** `null` when the requested bank day does not exist. */
  resolvePeriod(
    query: CashStatementPeriodQuery,
  ): Promise<CashStatementPeriod | null>;
  getTotals(period: CashStatementPeriod): Promise<CashStatementTotals>;
  findRows(
    period: CashStatementPeriod,
    filters: CashStatementRowFilters,
    page: number,
    limit: number,
  ): Promise<CashStatementRowPage>;
  /** Physical counts of the period for its location (Caja: arqueos + cut counts; Bodega: arqueos de Bodega). */
  findCounts(period: CashStatementPeriod): Promise<CashStatementCount[]>;
  /** The latest VIGENTE count before the period starts. */
  findPreviousCount(
    period: CashStatementPeriod,
  ): Promise<CashStatementCount | null>;
  /** Physical movements of the period after a given Kardex sequence. */
  countMovementsAfter(
    period: CashStatementPeriod,
    sequence: number,
  ): Promise<number>;
  /** Cuts whose operational day falls in the period (Caja). */
  findCuts(period: CashStatementPeriod): Promise<CashStatementCut[]>;
  /** Caja and Bodega balances at the end of the period (live when it is open). */
  getCustody(
    period: CashStatementPeriod,
  ): Promise<{ cash: number; warehouse: number }>;
  findDays(limit: number, withCounts: boolean): Promise<CashStatementDay[]>;
}

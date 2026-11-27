/**
 * Estado de Cuenta de Efectivo (API `/cash-control/statement`, 2026-11-21).
 * A read-only view of the official Kardex: every balance, total and
 * difference is computed by the backend — these types only mirror it.
 */

import type { CashCountResult } from './cash-custody.model';
import type { OpeningStatus } from './cash-integrity.model';

export type CashStatementLocation = 'CAJA' | 'BODEGA';
export type CashStatementCountStatus = CashCountResult | 'SIN_ARQUEO';

export interface CashStatementPeriod {
  /** BANK_DAY = Agentes Bancarios opening up to the next one; RANGE = calendar dates. */
  kind: 'BANK_DAY' | 'RANGE';
  businessDate: string | null;
  dateFrom: string;
  dateTo: string;
  windowStart: string;
  windowEnd: string | null;
  isCurrent: boolean;
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO' | null;
  openedByUsername: string | null;
  anchorSource: 'APERTURA' | 'BACKFILL' | null;
}

export interface CashStatementCount {
  id: string;
  source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
  number: string;
  countedAt: string;
  sequence: number;
  theoretical: number;
  counted: number;
  /** counted − theoretical (never adjusted). */
  difference: number;
  result: CashCountResult;
  status: 'VIGENTE' | 'REEMPLAZADO';
  username: string;
  observations: string | null;
}

export interface CashStatementSummary {
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  /** opening + entries − exits (backend). */
  theoreticalBalance: number;
  kardexClosingBalance: number;
  consistent: boolean;
  movementCount: number;
  lastMovement: {
    id: string;
    createdAt: string;
    movementType: string;
    direction: 'IN' | 'OUT';
    amount: number;
    description: string;
  } | null;
  toWarehouse: number;
  fromWarehouse: number;
  /** `null` for users without custody permission. */
  physical: {
    status: CashStatementCountStatus;
    count: CashStatementCount | null;
    movementsAfter: number;
  } | null;
}

export interface CashStatementWarning {
  code: 'OPENING_PENDING' | 'KARDEX_INCONSISTENT' | 'OPENING_ANCHOR_MISMATCH' | 'PREVIOUS_CLOSE_DIFFERENCE' | 'MOVEMENTS_AFTER_COUNT';
  tone: 'danger' | 'warning' | 'info';
  message: string;
}

/** One physical movement with the running balance after it (Kardex). */
export interface CashStatementRow {
  id: string;
  sequence: number;
  operationNumber: string;
  createdAt: string;
  movementType: string;
  originalMovementType: string | null;
  direction: 'IN' | 'OUT';
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  beneficiary: string | null;
  reference: string | null;
  referenceType: string | null;
  referenceId: string | null;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: string | null;
  voidReason: string | null;
  reversalOfId: string | null;
  /** Number of the original movement when this row is its reversal ("MOV-000123"). */
  reversalOfNumber: string | null;
  /** Why it was registered (manual entries, adjustments, reversals of a CxC / Activos change). */
  reason: string | null;
  username: string;
  cutPeriodNumber: number | null;
}

export interface CashStatementCut {
  id: string;
  periodNumber: number;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  cashDifference: number | null;
  closingWarehouseBalance: number | null;
  closedByUsername: string | null;
  observations: string | null;
}

export interface CashStatement {
  location: CashStatementLocation;
  period: CashStatementPeriod;
  summary: CashStatementSummary;
  warnings: CashStatementWarning[];
  movements: {
    items: CashStatementRow[];
    total: number;
    page: number;
    limit: number;
    filteredIn: number;
    filteredOut: number;
  };
  counts: CashStatementCount[] | null;
  cuts: CashStatementCut[] | null;
  custody: { cash: number; warehouse: number; total: number } | null;
  canViewCustody: boolean;
  /** Arqueo de apertura of the bank day (Caja, custody viewers). */
  opening: OpeningStatus | null;
}

export interface CashStatementDay {
  businessDate: string;
  isCurrent: boolean;
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO';
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  closingBalance: number;
  movementCount: number;
  lastCount: Pick<CashStatementCount, 'number' | 'result' | 'difference' | 'counted' | 'countedAt'> | null;
}

export interface CashStatementQuery {
  location?: CashStatementLocation;
  bankDate?: string;
  dateFrom?: string;
  dateTo?: string;
  direction?: 'IN' | 'OUT';
  movementType?: string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/** Arqueo de Bodega (control count with difference, migration 1760009100000). */
export interface WarehouseCashAudit {
  id: string;
  number: number;
  countedAt: string;
  businessDate: string;
  theoreticalBalance: number;
  totalCounted: number;
  difference: number;
  result: CashCountResult;
  observations: string | null;
  createdByUsername: string;
  details: { denomination: number; quantity: number; subtotal: number }[];
}

export const CASH_STATEMENT_STATUS_LABEL: Record<CashStatementCountStatus, string> = {
  CUADRADO: 'Cuadrado',
  FALTANTE: 'Faltante',
  SOBRANTE: 'Sobrante',
  SIN_ARQUEO: 'Sin arqueo',
};

/** Card color of each state: green cuadrado, red faltante, orange sobrante, gray sin arqueo. */
export const CASH_STATEMENT_STATUS_TONE: Record<CashStatementCountStatus, 'ok' | 'short' | 'over' | 'none'> = {
  CUADRADO: 'ok',
  FALTANTE: 'short',
  SOBRANTE: 'over',
  SIN_ARQUEO: 'none',
};

/** Bodega Kardex types (the Caja ones are in `CASH_MOVEMENT_TYPE_LABEL`). */
export const WAREHOUSE_STATEMENT_TYPE_LABEL: Record<string, string> = {
  SALDO_INICIAL: 'Saldo inicial de Bodega',
  ENTREGA_DESDE_CAJA: 'Recibido de Caja',
  DEVOLUCION_A_CAJA: 'Devolución a Caja',
  DEPOSITO_BANCARIO: 'Depósito a banco',
  ANULACION: 'Anulación',
};

/** Where the source operation of a Kardex row can be opened, when the app has a screen for it. */
export function statementOriginRoute(row: Pick<CashStatementRow, 'referenceType'>): { label: string; path: string } | null {
  switch (row.referenceType) {
    case 'ACCOUNT_RECEIVABLE':
      return { label: 'Cuentas por cobrar', path: '/dashboard/cuentas-por-cobrar' };
    case 'ASSET':
      return { label: 'Activos', path: '/dashboard/activos' };
    case 'WAREHOUSE_TRANSFER':
    case 'WAREHOUSE_WITHDRAWAL':
      return { label: 'Inventario y traslados', path: '/dashboard/control-efectivo' };
    default:
      return null;
  }
}

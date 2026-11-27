/**
 * Control de Efectivo — mirrors `modules/cash-control` of the API. Every
 * balance on these types comes from the backend's official Kardex
 * (`cash_movements`); the frontend never computes or stores a cash balance.
 */

export type CashDirection = 'IN' | 'OUT' | 'NONE';

export type CashMovementType =
  | 'DEPOSITO'
  | 'RETIRO'
  | 'DESEMBOLSO_GENESIS'
  | 'PAGO_GENESIS'
  | 'REINTEGRO'
  | 'OTRA_TRANSACCION'
  | 'GASTO_POR_COBRAR'
  | 'ABONO_POR_COBRAR'
  | 'ACTIVO'
  | 'DEVOLUCION_ACTIVO'
  | 'RETIRO_BANCARIO'
  | 'ENTRADA_MANUAL'
  | 'SALIDA_MANUAL'
  | 'AJUSTE'
  | 'SALDO_INICIAL'
  | 'ANULACION'
  /** Efectivo de caja depositado a una cuenta bancaria registrada (con desglose). */
  | 'DEPOSITO_BANCARIO'
  /** Internal transfer caja → Bodega (never an expense). */
  | 'ENTREGA_BODEGA'
  /** Internal transfer Bodega → caja (never an income). */
  | 'DEVOLUCION_BODEGA';

export type ManualCashMovementType = 'ENTRADA_MANUAL' | 'SALIDA_MANUAL' | 'AJUSTE' | 'SALDO_INICIAL';

export const CASH_MOVEMENT_TYPE_LABEL: Record<CashMovementType, string> = {
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
  ENTREGA_BODEGA: 'Entrega a Bodega (transferencia interna)',
  DEVOLUCION_BODEGA: 'Devolución de Bodega (transferencia interna)',
};

export const CASH_DIRECTION_LABEL: Record<CashDirection, string> = {
  IN: 'Entrada',
  OUT: 'Salida',
  NONE: 'Sin efecto',
};

/** One Kardex row: `previousBalance`/`newBalance` are the official cash before/after it. */
export interface CashMovement {
  id: string;
  sequence: number;
  operationalDate: string;
  operationalDayId: string | null;
  cutPeriodId: string | null;
  cutPeriodNumber: number | null;
  movementType: CashMovementType;
  originalMovementType: CashMovementType | null;
  direction: CashDirection;
  amount: number;
  previousBalance: number;
  newBalance: number;
  referenceType: string | null;
  referenceId: string | null;
  description: string;
  bankName: string | null;
  reason: string | null;
  reversalOfId: string | null;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
  /** Desglose por denominación — solo en `GET /cash-control/movements/:id` y en la respuesta del depósito bancario. */
  details?: { denomination: number; quantity: number; subtotal: number }[];
}

/** `POST /cash-control/bank-deposits` — el backend valida desglose, efectivo suficiente y reglas de la cuenta. */
export interface RegisterCashBankDepositInput {
  bankId: string;
  amount: number;
  details: { denomination: number; quantity: number }[];
  description?: string;
  clientRequestId: string;
}

export interface CashBalanceSnapshot {
  balance: number;
  lastSequence: number;
  lastMovementAt: string | null;
  /** Money reserved by open Pagos grupales; available = balance − reserved. */
  reserved?: number;
  available?: number;
}

export interface CashMovementBucket {
  movementType: CashMovementType;
  totalIn: number;
  totalOut: number;
  count: number;
}

export interface CashDateSummary {
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  movementCount: number;
  buckets: CashMovementBucket[];
}

/**
 * Daily indicators of one BANK operational day (Agentes Bancarios →
 * "Aperturar día"): they restart at each opening and cover the Kardex
 * movements up to the next opening. The physical balance never restarts.
 */
export interface CashBankDayHeader {
  businessDate: string;
  dayOpeningId: string;
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO';
  startSequence: number;
  endSequence: number | null;
  isCurrent: boolean;
  openedAt: string;
  openedByUsername: string;
  source: 'APERTURA' | 'BACKFILL';
  closingBalance: number;
  lastMovementAt: string | null;
}

export type CashBankDaySummary = CashBankDayHeader & CashDateSummary;

export type CashOpeningPolicy = 'INHERITED_FROM_CLOSE' | 'INHERITED_FROM_LAST_CUT' | 'AUTHORIZED_MANUAL' | 'SYSTEM_UNVERIFIED';

export const CASH_OPENING_POLICY_LABEL: Record<CashOpeningPolicy, string> = {
  INHERITED_FROM_CLOSE: 'Heredado del cierre anterior',
  INHERITED_FROM_LAST_CUT: 'Heredado del último corte (el día anterior no se cerró)',
  AUTHORIZED_MANUAL: 'Apertura autorizada manualmente',
  SYSTEM_UNVERIFIED: 'Saldo del sistema, sin arqueo previo (no verificado)',
};

export interface CashOperationalDay {
  id: string;
  operationalDate: string;
  status: 'ABIERTO' | 'CERRADO';
  openingPolicy: CashOpeningPolicy;
  previousDayId: string | null;
  previousCutId: string | null;
  previousClosingPhysicalCash: number | null;
  previousClosingSystemCash: number | null;
  inheritedDifference: number;
  openingSequence: number;
  openingSystemCash: number;
  openingPhysicalCash: number;
  openingReason: string | null;
  openedBy: string;
  openedByUsername: string;
  openedAt: string;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  closingDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  closingObservations: string | null;
  closedByUsername: string | null;
  closedAt: string | null;
}

export interface CashBankBalance {
  bankId: string;
  bankName: string;
  accountNumber: string | null;
  specialAccount: string | null;
  balance: number;
}

export type CashCutStatus = 'PROGRAMADO' | 'ABIERTO' | 'FINALIZADO';

export const CASH_CUT_STATUS_LABEL: Record<CashCutStatus, string> = {
  PROGRAMADO: 'Programado',
  ABIERTO: 'Abierto',
  FINALIZADO: 'Finalizado',
};

export const CASH_CUT_NAME: Record<1 | 2, string> = {
  1: 'Primer corte · mediodía',
  2: 'Segundo corte · final del día',
};

export interface CashCutPeriod {
  id: string;
  operationalDayId: string;
  operationalDate: string;
  periodNumber: 1 | 2;
  status: CashCutStatus;
  scheduledStartAt: string;
  scheduledEndAt: string;
  actualStartedAt: string | null;
  actualFinishedAt: string | null;
  startSequence: number | null;
  closingSequence: number | null;
  openingSystemCash: number | null;
  openingPhysicalCash: number | null;
  inheritedDifference: number | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  /**
   * Official Bodega balance when the cut was finished — Bodega is never
   * counted in a cut nor part of its difference. Null on cuts finished before
   * this was recorded (and on cuts not finished).
   */
  closingWarehouseBalance?: number | null;
  /** Total bajo resguardo = counted caja + Bodega balance (null when Bodega was not recorded). */
  closingCustodyTotal?: number | null;
  cashDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  openingBankBalances: CashBankBalance[] | null;
  openedByUsername: string | null;
  closedByUsername: string | null;
  observations: string | null;
  reopenedCount: number;
  bankDifferenceTotal: number | null;
  bankReconciledCount: number | null;
  /** Only in `position`: live values of an OPEN cut, read from the Kardex. */
  liveSystemCash?: number | null;
  /** Only in `position`, OPEN cut: the official Bodega balance right now. */
  liveWarehouseBalance?: number | null;
  liveTotalIn?: number | null;
  liveTotalOut?: number | null;
  liveMovementCount?: number | null;
}

export type CashDayState = 'SIN_APERTURA' | 'ABIERTO' | 'CERRADO';

export interface CashPosition {
  date: string;
  balance: number;
  lastSequence: number;
  lastMovementAt: string | null;
  /** Pagos grupales: reserved by open groups, and what other operations can use (balance − reserved). */
  reservedAmount?: number;
  availableAmount?: number;
  hasInitialBalance: boolean;
  dayState: CashDayState;
  day: CashOperationalDay | null;
  periods: CashCutPeriod[];
  openPeriod: CashCutPeriod | null;
  /** Indicators of the current bank day (or of the calendar date when no bank day was anchored yet). */
  summary: CashDateSummary;
  /** Official Bodega balance (its own Kardex). */
  warehouseBalance: number;
  /** caja + Bodega — an internal transfer never changes it. */
  custodyTotal: number;
  /** The bank day the indicators belong to; `null` = calendar-date fallback. */
  bankDay: CashBankDayHeader | null;
  canCloseDay: boolean;
}

export interface CashMovementFilters {
  dateFrom?: string;
  dateTo?: string;
  movementType?: CashMovementType | '';
  direction?: CashDirection | '';
  userId?: string;
  cutPeriodId?: string;
  /** Bank operational day: only the Kardex movements between its opening and the next one. */
  bankDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCashMovements {
  items: CashMovement[];
  total: number;
  page: number;
  limit: number;
  totalIn: number;
  totalOut: number;
}

export interface RegisterCashMovementInput {
  movementType: ManualCashMovementType;
  amount: number;
  description?: string;
  reason: string;
  clientRequestId: string;
}

export interface CashMovementResult {
  movement: CashMovement;
  balance: number;
}

export interface OpenCashDayInput {
  manualPhysicalCash?: number;
  reason?: string;
  firstStart?: string;
  firstEnd?: string;
  secondStart?: string;
  secondEnd?: string;
}

export interface CashDenominationCount {
  denomination: number;
  quantity: number;
}

export interface CashBankVerificationInput {
  bankId: string;
  verifiedBalance: number;
  observations?: string;
}

export interface FinishCashCutInput {
  details: CashDenominationCount[];
  banks: CashBankVerificationInput[];
  cashObservations?: string;
  observations?: string;
}

export interface CashCutCount {
  id: string;
  totalCounted: number;
  systemCash: number;
  difference: number;
  /** Official Bodega balance photographed with this arqueo (null on older cuts). */
  warehouseBalance?: number | null;
  observations: string | null;
  isCurrent: boolean;
  createdByUsername: string;
  createdAt: string;
  details: { denomination: number; quantity: number; subtotal: number }[];
}

export interface CashBankReconciliation {
  id: string;
  countId: string;
  bankId: string;
  bankName: string;
  systemBalance: number;
  verifiedBalance: number;
  difference: number;
  observations: string | null;
  createdAt: string;
}

export interface CashCutDetail {
  period: CashCutPeriod;
  day: CashOperationalDay;
  counts: CashCutCount[];
  bankReconciliations: CashBankReconciliation[];
  events: { id: string; action: 'INICIADO' | 'FINALIZADO' | 'REABIERTO'; reason: string | null; performedByUsername: string; performedAt: string }[];
  scheduleChanges: {
    id: string;
    previousStartAt: string;
    previousEndAt: string;
    newStartAt: string;
    newEndAt: string;
    reason: string;
    changedByUsername: string;
    changedAt: string;
  }[];
  movements: CashMovement[];
}

export interface CashDayHistoryRow {
  day: CashOperationalDay;
  periods: CashCutPeriod[];
}

export interface CashDayFilters {
  dateFrom?: string;
  dateTo?: string;
  periodNumber?: 1 | 2 | '';
  status?: CashCutStatus | 'CERRADO' | '';
  userId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCashDays {
  items: CashDayHistoryRow[];
  total: number;
  page: number;
  limit: number;
}

/** Roles that may open the day and run the cuts (the backend re-checks). */
export const CASH_CUT_MANAGER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO'];

/** Signed effect of a movement for display: +amount, −amount or 0. */
export function cashSignedAmount(movement: Pick<CashMovement, 'direction' | 'amount'>): number {
  return movement.direction === 'IN' ? movement.amount : movement.direction === 'OUT' ? -movement.amount : 0;
}

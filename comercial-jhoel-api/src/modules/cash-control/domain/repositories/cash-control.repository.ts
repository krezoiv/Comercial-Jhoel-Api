/**
 * Control de Efectivo — persistence port. The physical cash balance has ONE
 * official source: the `cash_movements` Kardex (`cash_balance()` in SQL).
 * Every write goes through the SQL functions of migration
 * `CreateCashControlKardexAndCuts` (advisory lock + atomic transaction);
 * nothing in TypeScript computes or stores a balance.
 */
export const CASH_CONTROL_REPOSITORY = Symbol('CASH_CONTROL_REPOSITORY');

export const CASH_DIRECTIONS = ['IN', 'OUT', 'NONE'] as const;
export type CashDirection = (typeof CASH_DIRECTIONS)[number];

export const CASH_MOVEMENT_TYPES = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
  'OTRA_TRANSACCION',
  'GASTO_POR_COBRAR',
  'ABONO_POR_COBRAR',
  'ACTIVO',
  'DEVOLUCION_ACTIVO',
  'RETIRO_BANCARIO',
  'ENTRADA_MANUAL',
  'SALIDA_MANUAL',
  'AJUSTE',
  'SALDO_INICIAL',
  'ANULACION',
  /** Cash deposited from the caja into a registered bank account (with breakdown). */
  'DEPOSITO_BANCARIO',
] as const;
export type CashMovementType = (typeof CASH_MOVEMENT_TYPES)[number];

/** Movements registered directly in Control de Efectivo (all others are born in their own module). */
export const MANUAL_CASH_MOVEMENT_TYPES = [
  'ENTRADA_MANUAL',
  'SALIDA_MANUAL',
  'AJUSTE',
  'SALDO_INICIAL',
] as const;
export type ManualCashMovementType =
  (typeof MANUAL_CASH_MOVEMENT_TYPES)[number];

export type CashCutStatus = 'PROGRAMADO' | 'ABIERTO' | 'FINALIZADO';
export type CashDayStatus = 'ABIERTO' | 'CERRADO';
export type CashOpeningPolicy =
  | 'INHERITED_FROM_CLOSE'
  | 'INHERITED_FROM_LAST_CUT'
  | 'AUTHORIZED_MANUAL'
  | 'SYSTEM_UNVERIFIED';

/** One Kardex row. `previousBalance`/`newBalance` are the official balances before/after it. */
export interface CashMovementRow {
  id: string;
  sequence: number;
  operationalDate: string;
  operationalDayId: string | null;
  cutPeriodId: string | null;
  cutPeriodNumber: number | null;
  movementType: CashMovementType;
  /** For an ANULACION, the type of the movement it reverses. */
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
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  /** Denomination breakdown — only loaded by `findMovementById` (empty when the movement has none). */
  details?: CashCountDetailRow[];
}

export interface CashBalanceSnapshot {
  balance: number;
  lastSequence: number;
  lastMovementAt: Date | null;
}

export interface CashMovementBucket {
  movementType: CashMovementType;
  totalIn: number;
  totalOut: number;
  count: number;
}

export interface CashRangeTotals {
  totalIn: number;
  totalOut: number;
  movementCount: number;
}

export interface CashDateSummary extends CashRangeTotals {
  /** Official balance at the end of the previous operational date. */
  openingBalance: number;
  buckets: CashMovementBucket[];
}

export interface CashOperationalDayRow {
  id: string;
  operationalDate: string;
  status: CashDayStatus;
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
  openedAt: Date;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  closingDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  closingObservations: string | null;
  closedByUsername: string | null;
  closedAt: Date | null;
}

export interface CashBankBalance {
  bankId: string;
  bankName: string;
  accountNumber: string | null;
  specialAccount: string | null;
  balance: number;
}

export interface CashCutPeriodRow {
  id: string;
  operationalDayId: string;
  operationalDate: string;
  periodNumber: 1 | 2;
  status: CashCutStatus;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  actualStartedAt: Date | null;
  actualFinishedAt: Date | null;
  startSequence: number | null;
  closingSequence: number | null;
  openingSystemCash: number | null;
  openingPhysicalCash: number | null;
  inheritedDifference: number | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  cashDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  openingBankBalances: CashBankBalance[] | null;
  openedByUsername: string | null;
  closedByUsername: string | null;
  observations: string | null;
  reopenedCount: number;
  /** Bank reconciliation of the current arqueo (FINALIZADO only). */
  bankDifferenceTotal: number | null;
  bankReconciledCount: number | null;
}

export interface CashCountDetailRow {
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface CashCountRow {
  id: string;
  totalCounted: number;
  systemCash: number;
  difference: number;
  observations: string | null;
  isCurrent: boolean;
  createdByUsername: string;
  createdAt: Date;
  details: CashCountDetailRow[];
}

export interface CashBankReconciliationRow {
  id: string;
  countId: string;
  bankId: string;
  bankName: string;
  systemBalance: number;
  verifiedBalance: number;
  difference: number;
  observations: string | null;
  createdAt: Date;
}

export interface CashCutEventRow {
  id: string;
  action: 'INICIADO' | 'FINALIZADO' | 'REABIERTO';
  reason: string | null;
  performedByUsername: string;
  performedAt: Date;
}

export interface CashScheduleChangeRow {
  id: string;
  previousStartAt: Date;
  previousEndAt: Date;
  newStartAt: Date;
  newEndAt: Date;
  reason: string;
  changedByUsername: string;
  changedAt: Date;
}

export interface CashCutDetail {
  period: CashCutPeriodRow;
  day: CashOperationalDayRow;
  counts: CashCountRow[];
  bankReconciliations: CashBankReconciliationRow[];
  events: CashCutEventRow[];
  scheduleChanges: CashScheduleChangeRow[];
  movements: CashMovementRow[];
}

export interface CashDayHistoryRow {
  day: CashOperationalDayRow;
  periods: CashCutPeriodRow[];
}

export interface FindCashMovementsOptions {
  dateFrom?: string;
  dateTo?: string;
  movementType?: CashMovementType;
  direction?: CashDirection;
  userId?: string;
  cutPeriodId?: string;
  page: number;
  limit: number;
}

export interface PaginatedCashMovements {
  items: CashMovementRow[];
  total: number;
  page: number;
  limit: number;
  totalIn: number;
  totalOut: number;
}

export interface FindCashDaysOptions {
  dateFrom?: string;
  dateTo?: string;
  periodNumber?: 1 | 2;
  status?: CashCutStatus | CashDayStatus;
  userId?: string;
  page: number;
  limit: number;
}

export interface PaginatedCashDays {
  items: CashDayHistoryRow[];
  total: number;
  page: number;
  limit: number;
}

export interface CashUserOption {
  id: string;
  username: string;
}

export interface RegisterManualCashMovementData {
  movementType: ManualCashMovementType;
  /** Signed for AJUSTE (+ in / − out); positive for the others. */
  amount: number;
  description: string | null;
  reason: string;
  idempotencyKey: string;
  userId: string;
}

export interface OpenCashDayData {
  date: string;
  userId: string;
  manualPhysicalCash: number | null;
  reason: string | null;
  firstStart: string | null;
  firstEnd: string | null;
  secondStart: string | null;
  secondEnd: string | null;
}

export interface RegisterCashBankDepositData {
  bankId: string;
  amount: number;
  details: CashDenominationData[];
  description: string | null;
  idempotencyKey: string;
  userId: string;
}

export interface CashDenominationData {
  denomination: number;
  quantity: number;
}

export interface CashBankVerificationData {
  bankId: string;
  verifiedBalance: number;
  observations: string | null;
}

export interface FinishCashCutData {
  periodId: string;
  userId: string;
  details: CashDenominationData[];
  banks: CashBankVerificationData[];
  cashObservations: string | null;
  observations: string | null;
}

export interface CashControlRepository {
  getBalance(): Promise<CashBalanceSnapshot>;
  getDateSummary(date: string): Promise<CashDateSummary>;
  getRangeTotals(
    afterSequence: number,
    upToSequence: number | null,
  ): Promise<CashRangeTotals>;
  hasInitialBalance(): Promise<boolean>;
  findMovements(
    options: FindCashMovementsOptions,
  ): Promise<PaginatedCashMovements>;
  findRecentMovements(limit: number): Promise<CashMovementRow[]>;
  findMovementById(id: string): Promise<CashMovementRow | null>;
  findMovementsByReference(
    referenceType: string,
    referenceId: string,
  ): Promise<CashMovementRow[]>;
  findUsers(): Promise<CashUserOption[]>;
  registerManualMovement(data: RegisterManualCashMovementData): Promise<string>;
  voidManualMovement(
    id: string,
    userId: string,
    reason: string,
  ): Promise<string>;
  /** Cash → bank deposit with breakdown; returns the Kardex movement id. */
  registerBankDeposit(data: RegisterCashBankDepositData): Promise<string>;

  findDayByDate(date: string): Promise<CashOperationalDayRow | null>;
  findDayById(id: string): Promise<CashOperationalDayRow | null>;
  findPeriodsByDay(dayId: string): Promise<CashCutPeriodRow[]>;
  findOpenPeriod(): Promise<CashCutPeriodRow | null>;
  findPeriodById(id: string): Promise<CashCutPeriodRow | null>;
  getBankBalances(): Promise<CashBankBalance[]>;
  openDay(data: OpenCashDayData): Promise<string>;
  updateSchedule(
    periodId: string,
    start: string,
    end: string,
    reason: string,
    userId: string,
  ): Promise<void>;
  startPeriod(periodId: string, userId: string): Promise<void>;
  finishPeriod(data: FinishCashCutData): Promise<void>;
  reopenPeriod(periodId: string, userId: string, reason: string): Promise<void>;
  closeDay(
    dayId: string,
    userId: string,
    observations: string | null,
  ): Promise<void>;
  findDays(options: FindCashDaysOptions): Promise<PaginatedCashDays>;
  findCutDetail(periodId: string): Promise<CashCutDetail | null>;
}

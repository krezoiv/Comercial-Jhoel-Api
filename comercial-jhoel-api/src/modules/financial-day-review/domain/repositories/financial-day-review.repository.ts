/**
 * Port of "Revisión de días operativos". Reads return the raw rows of ONE
 * operational day exactly as stored (plus the review adjustments in force);
 * every calculation over them lives in the pure domain service
 * `financial-day-diagnostics.ts`. Writes delegate to the PostgreSQL functions
 * of migration 1760007100000, which enforce isolation, RBAC and audit.
 */
export const FINANCIAL_DAY_REVIEW_REPOSITORY = Symbol(
  'FINANCIAL_DAY_REVIEW_REPOSITORY',
);

export const REVIEW_SESSION_STATUSES = [
  'OPEN',
  'IN_REVIEW',
  'PENDING_CONFIRMATION',
  'CLOSED',
] as const;
export type ReviewSessionStatus = (typeof REVIEW_SESSION_STATUSES)[number];

/** Day-owned snapshot rows that are corrected in place (with a version). */
export const SNAPSHOT_TARGETS = {
  BANK_BALANCE: ['previous_balance', 'final_balance'],
  AGENT_RECONCILIATION: [
    'total_cash',
    'total_banks',
    'total_assets',
    'total_accounts_receivable',
  ],
  CASH_DAY: ['opening_physical_cash', 'closing_physical_cash'],
  CASH_CUT_PERIOD: ['opening_physical_cash'],
  CASH_CUT_COUNT: ['total_counted'],
  CASH_BANK_RECONCILIATION: ['verified_balance'],
} as const;
export type SnapshotTarget = keyof typeof SNAPSHOT_TARGETS;

/** Ledger records corrected through a linked adjustment (never edited). */
export const MOVEMENT_SOURCES = [
  'CASH_MOVEMENT',
  'BANK_MOVEMENT',
  'TRANSACTION',
  'ACCOUNT_RECEIVABLE',
  'ASSET',
] as const;
export type MovementSource = (typeof MOVEMENT_SOURCES)[number];

export type ReviewModule =
  | 'BANCOS'
  | 'EFECTIVO'
  | 'CORTES'
  | 'CUENTAS_POR_COBRAR'
  | 'ACTIVOS'
  | 'TRANSACCIONES'
  | 'CUADRE';

export interface ReviewSessionRow {
  id: string;
  reviewDate: string;
  status: ReviewSessionStatus;
  reason: string;
  openedById: string;
  openedByUsername: string;
  openedAt: Date;
  closeRequestedAt: Date | null;
  closedByUsername: string | null;
  closedAt: Date | null;
  closeObservations: string | null;
  correctionsCount: number;
  hasPendingDifferences: boolean | null;
  differenceBefore: number | null;
  differenceAfter: number | null;
  snapshotBefore: unknown;
  snapshotAfter: unknown;
}

export interface CorrectionRow {
  id: string;
  sessionId: string;
  reviewDate: string;
  module: ReviewModule;
  correctionType: 'SNAPSHOT_VERSION' | 'MOVEMENT_ADJUSTMENT';
  targetTable: string;
  targetId: string;
  field: string;
  originalValue: number;
  newValue: number;
  difference: number;
  reason: string;
  observations: string | null;
  originalReference: string | null;
  createdByUsername: string;
  createdAt: Date;
}

/** One calendar row (cheap aggregates, no full diagnosis). */
export interface FinancialDayListRow {
  date: string;
  agentDayStatus: 'ABIERTO' | 'CERRADO' | 'CANCELADO' | null;
  cashDayStatus: 'ABIERTO' | 'CERRADO' | null;
  cashOpening: number | null;
  cashClosing: number | null;
  totalBanks: number | null;
  totalAccountsReceivable: number | null;
  totalAssets: number | null;
  reconciliationResult: number | null;
  movementCount: number;
  cutCount: number;
  hasDifferences: boolean;
  activeSessionId: string | null;
  activeSessionUsername: string | null;
  reviewCount: number;
}

export interface AgentDayRaw {
  status: 'ABIERTO' | 'CERRADO' | 'CANCELADO';
  openedAt: Date;
  openedByUsername: string;
  closedAt: Date | null;
  closedByUsername: string | null;
  reopenedAt: Date | null;
  reopenReason: string | null;
}

export interface DayBankRaw {
  bankId: string;
  name: string;
  accountNumber: string | null;
  specialAccount: string | null;
  accountTypeName: string;
  isActive: boolean;
  balanceRowId: string | null;
  previousBalance: number | null;
  finalBalance: number | null;
  previousDayDate: string | null;
  previousDayFinal: number | null;
  nextDayDate: string | null;
  nextDayPrevious: number | null;
  ledgerOpening: number | null;
  firstLedgerDate: string | null;
}

export interface DayBankMovementRaw {
  id: string;
  sequence: number;
  bankId: string;
  bankName: string;
  movementType: string;
  origin: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  referenceType: string | null;
  referenceId: string | null;
  referenceText: string | null;
  concept: string | null;
  createdAt: Date;
  username: string;
}

export interface DayTransactionRaw {
  id: string;
  typeName: string | null;
  balanceEffect: string | null;
  cashEffect: string | null;
  totalAmount: number;
  transactionCount: number;
  agentBankName: string | null;
  bankAccountId: string | null;
  bankAccountName: string | null;
  clientName: string | null;
  /** "Descripción / Beneficiario" of the Transaccionar operation (`null` on historical rows). */
  description: string | null;
  isVoided: boolean;
  createdAt: Date;
  username: string;
}

export interface DayCashMovementRaw {
  id: string;
  sequence: number;
  movementType: string;
  direction: 'IN' | 'OUT' | 'NONE';
  amount: number;
  previousBalance: number;
  newBalance: number;
  status: string;
  referenceType: string | null;
  referenceId: string | null;
  description: string;
  bankName: string | null;
  cutPeriodId: string | null;
  createdAt: Date;
  username: string;
}

export interface CashDayRaw {
  id: string;
  status: 'ABIERTO' | 'CERRADO';
  openingPolicy: string;
  openingSystemCash: number;
  openingPhysicalCash: number;
  previousClosingPhysicalCash: number | null;
  previousClosingSystemCash: number | null;
  inheritedDifference: number;
  openingSequence: number;
  closingSequence: number | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  closingDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  openedAt: Date;
  closedAt: Date | null;
  previousDayDate: string | null;
  previousDayClosingPhysical: number | null;
  nextDayDate: string | null;
  nextDayOpeningPhysical: number | null;
}

export interface CutCountRaw {
  id: string;
  totalCounted: number;
  systemCash: number;
  difference: number;
  isCurrent: boolean;
  createdAt: Date;
  username: string;
}

export interface CutBankReconciliationRaw {
  id: string;
  bankId: string;
  bankName: string;
  systemBalance: number;
  verifiedBalance: number;
  difference: number;
  countId: string;
}

export interface CashCutRaw {
  id: string;
  periodNumber: number;
  status: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  actualStartedAt: Date | null;
  actualFinishedAt: Date | null;
  startSequence: number | null;
  closingSequence: number | null;
  openingSystemCash: number | null;
  openingPhysicalCash: number | null;
  closingSystemCash: number | null;
  closingPhysicalCash: number | null;
  cashDifference: number | null;
  totalIn: number | null;
  totalOut: number | null;
  movementCount: number | null;
  reopenedCount: number;
  /** Recomputed from the Kardex range (start_sequence, closing_sequence]. */
  rangeIn: number;
  rangeOut: number;
  rangeCount: number;
  counts: CutCountRaw[];
  bankReconciliations: CutBankReconciliationRaw[];
}

export interface PortfolioRowRaw {
  id: string;
  sequence: number;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  referenceType: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  username: string;
}

export interface PortfolioClientRaw {
  clientId: string;
  clientName: string;
  /** Signed sum of active rows dated before the day. */
  opening: number;
  charges: number;
  payments: number;
  /** ABONOs of a "Cancelar cuenta(s)" operation (`reference_type = 'AR_PAYMENT'`). */
  settlements: number;
}

/** A row that can explain why a stored total differs from today's recalculation. */
export interface PortfolioLateRowRaw extends PortfolioRowRaw {
  kind:
    | 'CREATED_AFTER_CLOSE'
    | 'DEACTIVATED_AFTER_CLOSE'
    | 'LATER_DATE_BEFORE_CLOSE';
}

export interface PortfolioRaw {
  clients: PortfolioClientRaw[];
  rows: PortfolioRowRaw[];
  lateRows: PortfolioLateRowRaw[];
}

export interface ReconciliationRaw {
  id: string;
  totalCash: number;
  /** Bodega cash included in the consolidated cuadre (0 before migration 1760007400000). */
  totalWarehouseCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdAt: Date;
  username: string;
  rowsForDate: number;
}

export interface AdjustmentEffectRaw {
  scope: 'CASH' | 'BANK' | 'AR' | 'ASSET';
  bankId: string | null;
  clientId: string | null;
  amount: number;
}

export interface AdjustmentRaw {
  id: string;
  correctionId: string;
  module: ReviewModule;
  sourceTable: string;
  sourceId: string;
  originalAmount: number;
  correctedAmount: number;
  delta: number;
  effects: AdjustmentEffectRaw[];
}

export interface AdjacentMovementRaw {
  source: 'BANK_MOVEMENT' | 'CASH_MOVEMENT' | 'ACCOUNT_RECEIVABLE' | 'ASSET';
  id: string;
  date: string;
  label: string;
  amount: number;
  bankId: string | null;
}

/** Everything stored for ONE operational day. */
export interface FinancialDayRawData {
  date: string;
  agentDay: AgentDayRaw | null;
  banks: DayBankRaw[];
  bankMovements: DayBankMovementRaw[];
  transactions: DayTransactionRaw[];
  cashDay: CashDayRaw | null;
  cuts: CashCutRaw[];
  cashMovements: DayCashMovementRaw[];
  receivables: PortfolioRaw;
  assets: PortfolioRaw;
  reconciliation: ReconciliationRaw | null;
  adjustments: AdjustmentRaw[];
  /** Movements of the previous/next day (to spot a movement registered on the wrong date). */
  adjacentMovements: AdjacentMovementRaw[];
}

export interface PhotographSummary {
  snapshot: unknown;
  totalDifference: number;
  hasPendingDifferences: boolean;
}

export interface CorrectSnapshotData {
  sessionId: string;
  target: SnapshotTarget;
  targetId: string;
  field: string;
  newValue: number;
  reason: string;
  observations?: string | null;
  userId: string;
  requestId: string;
}

export interface AdjustMovementData {
  sessionId: string;
  source: MovementSource;
  sourceId: string;
  correctedAmount: number;
  reason: string;
  observations?: string | null;
  userId: string;
  requestId: string;
}

export interface CloseSessionData {
  sessionId: string;
  userId: string;
  observations?: string | null;
  acceptPendingDifferences: boolean;
}

export interface FinancialDayReviewRepository {
  listDays(from: string, to: string): Promise<FinancialDayListRow[]>;
  getDayData(date: string): Promise<FinancialDayRawData>;
  /**
   * Opens the session and stores its "before" photograph in ONE transaction.
   * `photograph` builds it from the day's data read inside that transaction.
   */
  openSession(
    date: string,
    userId: string,
    reason: string,
    photograph: (data: FinancialDayRawData) => PhotographSummary,
  ): Promise<string>;
  correctSnapshot(data: CorrectSnapshotData): Promise<string>;
  adjustMovement(data: AdjustMovementData): Promise<string>;
  requestClose(sessionId: string, userId: string): Promise<void>;
  /**
   * Locks the session, rebuilds the day's "after" photograph inside the same
   * transaction and closes it.
   */
  closeSession(
    data: CloseSessionData,
    photograph: (data: FinancialDayRawData) => PhotographSummary,
  ): Promise<void>;
  findSessionById(id: string): Promise<ReviewSessionRow | null>;
  findActiveSession(date: string): Promise<ReviewSessionRow | null>;
  listSessions(date: string): Promise<ReviewSessionRow[]>;
  listCorrections(filter: {
    date?: string;
    sessionId?: string;
  }): Promise<CorrectionRow[]>;
}

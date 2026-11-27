import type {
  IntegrityClassification,
  LinkedChargeOfVoidedOperation,
  SourceComparison,
  TimelineCount,
} from '../cash-integrity';

export const CASH_INTEGRITY_REPOSITORY = Symbol('CASH_INTEGRITY_REPOSITORY');

/** Where the audit looks: a Kardex sequence span and its time window. */
export interface IntegrityScope {
  /** Caja rows `afterSequence < sequence ≤ upToSequence` (null = up to now). */
  afterSequence: number;
  upToSequence: number | null;
  windowStart: Date;
  windowEnd: Date | null;
}

export interface ChainBreak {
  id: string;
  sequence: number;
  movementType: string;
  createdAt: Date;
  username: string;
  previousBalance: number;
  /** new_balance of the row right before it. */
  expectedPrevious: number;
}

export interface SignViolation {
  id: string;
  sequence: number;
  kind: 'SIGN' | 'REVERSAL_MISMATCH' | 'REVERSAL_MISSING';
  movementType: string;
  direction: string;
  expectedDirection: string | null;
  amount: number;
  createdAt: Date;
  username: string;
  description: string;
}

export interface PossibleDuplicate {
  firstId: string;
  secondId: string;
  movementType: string;
  amount: number;
  direction: string;
  description: string;
  username: string;
  firstAt: Date;
  secondAt: Date;
}

export interface SnapshotMismatch {
  key: string;
  label: string;
  /** What the other module stored. */
  stored: number;
  /** What the Kardex says for the same point. */
  kardex: number;
  occurredAt: Date | null;
  username: string | null;
  /** BACKFILL anchors were reconstructed: a historical inconsistency, not a calculation error. */
  historical: boolean;
}

/** The arqueo de apertura of a bank day and its reconciliation with the previous closing. */
export interface OpeningStatus {
  dayOpeningId: string;
  businessDate: string;
  /** Official closing of the previous day (Kardex at the opening). */
  previousCloseBalance: number;
  /** Kardex now (for the live preview of a pending opening count). */
  currentTheoretical: number;
  movementsSinceOpening: number;
  /** The last physical count before the day. */
  lastCountBefore: {
    label: string;
    countedAt: Date;
    counted: number;
    difference: number;
  } | null;
  opening: {
    countId: string;
    number: number;
    countedAt: Date;
    counted: number;
    theoretical: number;
    difference: number;
    reason: string | null;
    responsible: string | null;
    username: string;
    movementsSinceOpening: number;
  } | null;
}

export interface RegisterOpeningCountData {
  details: Array<{ denomination: number; quantity: number }>;
  observations: string | null;
  reason: string | null;
  responsible: string | null;
  userId: string;
  idempotencyKey: string;
}

export interface ResolveDifferenceData {
  source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
  countId: string;
  cause: IntegrityClassification;
  explanation: string;
  withAdjustment: boolean;
  userId: string;
  idempotencyKey: string;
}

export interface CashIntegrityRepository {
  findChainBreaks(scope: IntegrityScope): Promise<ChainBreak[]>;
  findSignViolations(scope: IntegrityScope): Promise<SignViolation[]>;
  /** Source operations of the scope (created in its window or with Kardex rows in it) vs their Kardex effect. */
  findSourceComparisons(scope: IntegrityScope): Promise<SourceComparison[]>;
  findPossibleDuplicates(
    scope: IntegrityScope,
    minutes: number,
  ): Promise<PossibleDuplicate[]>;
  findSnapshotMismatches(scope: IntegrityScope): Promise<SnapshotMismatch[]>;
  /** Active CxC / Activos cargos whose Transaccionar operation was voided inside the window. */
  findLinkedChargesOfVoidedOperations(
    scope: IntegrityScope,
  ): Promise<LinkedChargeOfVoidedOperation[]>;
  /** Caja counts (arqueos, openings, cut counts) of the window, plus the last one before it. */
  findCajaTimeline(
    scope: IntegrityScope,
  ): Promise<{ previous: TimelineCount | null; counts: TimelineCount[] }>;
  /** Bodega arqueos of the window, plus the last one before it. */
  findBodegaTimeline(
    scope: IntegrityScope,
  ): Promise<{ previous: TimelineCount | null; counts: TimelineCount[] }>;
  /** Kardex sequence of each movement (to relate findings with count windows). */
  findSequences(ids: string[]): Promise<Map<string, number>>;
  /** Opening status of a bank day (default: the current one); null when no bank day is open. */
  getOpeningStatus(dayOpeningId?: string): Promise<OpeningStatus | null>;
  registerOpeningCount(data: RegisterOpeningCountData): Promise<string>;
  resolveDifference(data: ResolveDifferenceData): Promise<string>;
}

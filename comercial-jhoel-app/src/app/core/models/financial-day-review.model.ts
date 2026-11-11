/**
 * Sistema → Administración financiera → Revisión de días operativos.
 * Mirrors the API (`/financial-day-reviews`). Every figure, difference and
 * recalculation comes from the backend; the UI never recomputes balances.
 */

export type ReviewSessionStatus =
  'OPEN' | 'IN_REVIEW' | 'PENDING_CONFIRMATION' | 'CLOSED';

export type ReviewModule =
  | 'BANCOS'
  | 'EFECTIVO'
  | 'CORTES'
  | 'CUENTAS_POR_COBRAR'
  | 'ACTIVOS'
  | 'TRANSACCIONES'
  | 'CUADRE';

export type SnapshotTarget =
  | 'BANK_BALANCE'
  | 'AGENT_RECONCILIATION'
  | 'CASH_DAY'
  | 'CASH_CUT_PERIOD'
  | 'CASH_CUT_COUNT'
  | 'CASH_BANK_RECONCILIATION';

export type MovementSource =
  | 'CASH_MOVEMENT'
  | 'BANK_MOVEMENT'
  | 'TRANSACTION'
  | 'ACCOUNT_RECEIVABLE'
  | 'ASSET';

export interface FinancialDayListItem {
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

export interface ReviewSession {
  id: string;
  reviewDate: string;
  status: ReviewSessionStatus;
  reason: string;
  openedById: string;
  openedByUsername: string;
  openedAt: string;
  closeRequestedAt: string | null;
  closedByUsername: string | null;
  closedAt: string | null;
  closeObservations: string | null;
  correctionsCount: number;
  hasPendingDifferences: boolean | null;
  differenceBefore: number | null;
  differenceAfter: number | null;
}

export interface ReviewCorrection {
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
  createdAt: string;
}

export type MatchKind =
  'EXACT' | 'SIGN_INVERTED' | 'PAIR' | 'ADJACENT_DAY' | 'LATE_ROW';

export interface RelatedMovement {
  source: string;
  id: string;
  label: string;
  amount: number;
  date: string;
  match: MatchKind;
  pairWithId?: string;
}

export interface DifferenceItem {
  key: string;
  module: ReviewModule;
  account: string;
  type: string;
  label: string;
  expected: number;
  registered: number;
  difference: number;
  related: RelatedMovement[];
  reference: string;
  target: {
    kind: 'SNAPSHOT' | 'INFO';
    target?: SnapshotTarget;
    targetId?: string;
    field?: string;
  } | null;
}

export interface BankDiagnosis {
  bankId: string;
  name: string;
  maskedAccount: string | null;
  specialAccount: string | null;
  accountTypeName: string;
  creditLine: boolean;
  outsideReconciliation: boolean;
  balanceRowId: string | null;
  openingRegistered: number | null;
  previousDayDate: string | null;
  previousDayFinal: number | null;
  openingMismatch: number | null;
  ledgerAvailable: boolean;
  ledgerOpening: number | null;
  totals: Record<
    | 'deposits'
    | 'withdrawals'
    | 'transfersIn'
    | 'transfersOut'
    | 'disbursements'
    | 'payments'
    | 'reimbursements'
    | 'adjustments',
    number
  >;
  reviewAdjustments: number;
  movementsTotal: number;
  theoreticalClosing: number | null;
  registeredClosing: number | null;
  difference: number | null;
  nextDayDate: string | null;
  nextDayOpening: number | null;
  nextDayMismatch: number | null;
  movementCount: number;
}

export interface CashDiagnosis {
  available: boolean;
  dayId: string | null;
  status: string | null;
  openingPolicy: string | null;
  openingSystem: number | null;
  openingPhysical: number | null;
  previousDayDate: string | null;
  previousDayClosingPhysical: number | null;
  openingMismatch: number | null;
  totalIn: number;
  totalOut: number;
  reviewAdjustments: number;
  theoretical: number | null;
  registeredSystemClosing: number | null;
  kardexDifference: number | null;
  counted: number | null;
  physicalDifference: number | null;
  registeredClosingDifference: number | null;
  nextDayDate: string | null;
  nextDayOpeningPhysical: number | null;
  nextDayMismatch: number | null;
  movementCount: number;
}

export interface CutDiagnosis {
  id: string;
  periodNumber: number;
  status: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  actualStartedAt: string | null;
  actualFinishedAt: string | null;
  openingSystem: number | null;
  openingPhysical: number | null;
  closingSystem: number | null;
  closingPhysical: number | null;
  cashDifference: number | null;
  registeredIn: number | null;
  registeredOut: number | null;
  recomputedIn: number;
  recomputedOut: number;
  movementCount: number;
  reopenedCount: number;
  currentCount: {
    id: string;
    totalCounted: number;
    systemCash: number;
    difference: number;
    username: string;
    createdAt: string;
  } | null;
  previousCounts: number;
  bankReconciliations: Array<{
    id: string;
    bankName: string;
    systemBalance: number;
    verifiedBalance: number;
    difference: number;
  }>;
}

export interface PortfolioRow {
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
  createdAt: string;
  username: string;
  adjustment: { correctedAmount: number; delta: number } | null;
}

export interface PortfolioDiagnosis {
  clients: Array<{
    clientId: string;
    clientName: string;
    opening: number;
    charges: number;
    payments: number;
    settlements: number;
    reviewAdjustments: number;
    closing: number;
  }>;
  totals: {
    opening: number;
    charges: number;
    payments: number;
    settlements: number;
    reviewAdjustments: number;
    closing: number;
  };
  rows: PortfolioRow[];
  registeredTotal: number | null;
  difference: number | null;
  lateRows: Array<
    PortfolioRow & {
      kind:
        | 'CREATED_AFTER_CLOSE'
        | 'DEACTIVATED_AFTER_CLOSE'
        | 'LATER_DATE_BEFORE_CLOSE';
    }
  >;
}

export interface ReconciliationDiagnosis {
  available: boolean;
  id: string | null;
  totalCash: number | null;
  totalBanks: number | null;
  totalAssets: number | null;
  totalAccountsReceivable: number | null;
  result: number | null;
  recomputedResult: number | null;
  createdAt: string | null;
  username: string | null;
  rowsForDate: number;
  expectedBanks: number | null;
  /** Same sum with BI Club subtracting (rule before its debt model). */
  expectedBanksPreviousRule: number | null;
  missingBankSnapshots: string[];
  expectedAccountsReceivable: number;
  expectedAssets: number;
  expectedCash: number | null;
}

export interface DayMovement {
  source: MovementSource;
  id: string;
  at: string;
  type: string;
  label: string;
  amount: number;
  account: string | null;
  cashEffect: number;
  bankEffect: number;
  balanceBefore: number | null;
  balanceAfter: number | null;
  reference: string | null;
  username: string;
  status: 'VIGENTE' | 'ANULADO';
  adjustable: boolean;
  adjustment: { correctedAmount: number; delta: number } | null;
}

export interface FinancialDayDiagnosis {
  date: string;
  agentDay: {
    status: 'ABIERTO' | 'CERRADO' | 'CANCELADO';
    openedAt: string;
    openedByUsername: string;
    closedAt: string | null;
    closedByUsername: string | null;
    reopenedAt: string | null;
    reopenReason: string | null;
  } | null;
  banks: BankDiagnosis[];
  bankTotals: {
    opening: number;
    movements: number;
    theoretical: number;
    registered: number;
    difference: number;
  };
  cash: CashDiagnosis;
  cuts: CutDiagnosis[];
  receivables: PortfolioDiagnosis;
  assets: PortfolioDiagnosis;
  reconciliation: ReconciliationDiagnosis;
  movements: DayMovement[];
  differences: DifferenceItem[];
  totalAbsoluteDifference: number;
  hasPendingDifferences: boolean;
}

export interface FinancialDayDetail {
  date: string;
  diagnosis: FinancialDayDiagnosis;
  activeSession: ReviewSession | null;
  sessions: ReviewSession[];
  corrections: ReviewCorrection[];
  permissions: {
    canReview: boolean;
    canCorrect: boolean;
    isSessionOwner: boolean;
  };
}

export interface CloseReviewSummary {
  session: ReviewSession;
  totalCorrections: number;
  byModule: Partial<Record<ReviewModule, number>>;
  banksModified: number;
  cashCorrections: number;
  receivableCorrections: number;
  assetCorrections: number;
  differenceBefore: number | null;
  differenceAfter: number;
  hasPendingDifferences: boolean;
  pendingDifferences: DifferenceItem[];
}

/** What the correction modal edits: a day snapshot value or a movement amount. */
export type CorrectionRequest =
  | {
      kind: 'SNAPSHOT';
      target: SnapshotTarget;
      targetId: string;
      field: string;
      module: ReviewModule;
      label: string;
      originalValue: number;
      allowNegative: boolean;
    }
  | {
      kind: 'MOVEMENT';
      source: MovementSource;
      sourceId: string;
      module: ReviewModule;
      label: string;
      originalValue: number;
      allowNegative: false;
    };

export const REVIEW_STATUS_LABEL: Record<ReviewSessionStatus, string> = {
  OPEN: 'Abierta',
  IN_REVIEW: 'En revisión',
  PENDING_CONFIRMATION: 'Pendiente de confirmación',
  CLOSED: 'Cerrada',
};

export const REVIEW_MODULE_LABEL: Record<ReviewModule, string> = {
  BANCOS: 'Bancos',
  EFECTIVO: 'Efectivo',
  CORTES: 'Cortes',
  CUENTAS_POR_COBRAR: 'Cuentas por cobrar',
  ACTIVOS: 'Activos',
  TRANSACCIONES: 'Transacciones',
  CUADRE: 'Cuadre de Agentes',
};

export const MATCH_LABEL: Record<MatchKind, string> = {
  EXACT: 'Mismo monto que la diferencia',
  SIGN_INVERTED: 'La mitad de la diferencia (posible signo invertido)',
  PAIR: 'Junto con otro movimiento suma la diferencia',
  ADJACENT_DAY: 'Mismo monto registrado el día anterior/siguiente',
  LATE_ROW: 'Cambió después del cierre del día',
};

export const DIFFERENCE_TYPE_LABEL: Partial<Record<string, string>> = {
  SALDO_FINAL_NO_CUADRA: 'Saldo final no cuadra',
  APERTURA_DISTINTA_AL_CIERRE_ANTERIOR: 'Apertura ≠ cierre anterior',
  DIA_SIGUIENTE_ABRE_DISTINTO: 'Día siguiente abre distinto',
  KARDEX_NO_CUADRA: 'Kardex no cuadra',
  ARQUEO_CON_DIFERENCIA: 'Arqueo con diferencia',
  TOTALES_DEL_CORTE_NO_CUADRAN: 'Totales del corte',
  CONCILIACION_CON_DIFERENCIA: 'Conciliación bancaria',
  CORTE_2_ABRE_DISTINTO: 'Corte 2 abre distinto',
  RESULTADO_DEL_CUADRE: 'Resultado del cuadre',
  RESULTADO_MAL_CALCULADO: 'Resultado mal calculado',
  BANCOS_DISTINTOS_A_LA_FOTO: 'Bancos ≠ saldos del día',
  CXC_DISTINTA_AL_CIERRE: 'CxC ≠ saldo recalculado',
  ACTIVOS_DISTINTOS_AL_CIERRE: 'Activos ≠ saldo recalculado',
  EFECTIVO_DISTINTO_AL_ARQUEO: 'Efectivo ≠ arqueo',
};

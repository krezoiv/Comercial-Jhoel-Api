import {
  AdjustmentRaw,
  DayBankRaw,
  FinancialDayRawData,
  MovementSource,
  PortfolioLateRowRaw,
  PortfolioRaw,
  PortfolioRowRaw,
  PhotographSummary,
  ReviewModule,
} from '../repositories/financial-day-review.repository';

/**
 * Pure diagnosis of ONE operational day: recomputes every figure from the
 * stored movements (plus the review adjustments in force) and compares it
 * with what was registered. It never guesses causes: a difference is listed
 * only when two stored/recomputed values disagree, and the "related
 * movements" are only rows whose amounts verifiably match that difference
 * (exact, sign inverted, a pair, or a same-amount movement on the
 * previous/next day) or rows that changed after the day was closed.
 */

const EPSILON = 0.005;

/** Rounds to cents (avoids binary float noise in every sum). */
export function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

function isZero(value: number | null | undefined): boolean {
  return value === null || value === undefined || Math.abs(value) < EPSILON;
}

/** Shows only the last 4 digits of an account number. */
export function maskAccountNumber(accountNumber: string | null): string | null {
  if (!accountNumber) {
    return null;
  }
  const clean = accountNumber.trim();
  if (clean.length <= 4) {
    return clean;
  }
  return `${'•'.repeat(Math.min(clean.length - 4, 6))}${clean.slice(-4)}`;
}

/** Same rule as `GetCuadreAgentesSummaryUseCase`: a "crédito" account type subtracts (except BI Club). */
export function isCreditLineType(
  accountTypeName: string,
  specialAccount: string | null,
): boolean {
  if (specialAccount === 'BI_CLUB') {
    return false;
  }
  return accountTypeName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .includes('credito');
}

export type BankMovementCategory =
  | 'deposits'
  | 'withdrawals'
  | 'transfersIn'
  | 'transfersOut'
  | 'disbursements'
  | 'payments'
  | 'reimbursements'
  | 'adjustments';

const BANK_CATEGORY: Record<string, BankMovementCategory> = {
  DEPOSITO: 'deposits',
  DEPOSITO_CAJA: 'deposits',
  COBRO_CXC: 'deposits',
  RETIRO: 'withdrawals',
  RETIRO_EFECTIVO: 'withdrawals',
  TRANSFERENCIA_ENTRADA: 'transfersIn',
  TRANSFERENCIA_SALIDA: 'transfersOut',
  DESEMBOLSO_GENESIS: 'disbursements',
  PAGO_GENESIS: 'payments',
  REINTEGRO: 'reimbursements',
};

/** Ledger movement type → column of the "Agentes Bancarios" panel. */
export function bankMovementCategory(
  movementType: string,
): BankMovementCategory {
  return BANK_CATEGORY[movementType] ?? 'adjustments';
}

export type MatchKind =
  'EXACT' | 'SIGN_INVERTED' | 'PAIR' | 'ADJACENT_DAY' | 'LATE_ROW';

export interface RelatedMovement {
  source: MovementSource | 'ACCOUNT_RECEIVABLE' | 'ASSET';
  id: string;
  label: string;
  amount: number;
  date: string;
  match: MatchKind;
  pairWithId?: string;
}

export interface CandidateMovement {
  source: RelatedMovement['source'];
  id: string;
  label: string;
  /** Signed effect on the figure being explained. */
  amount: number;
  date: string;
}

/**
 * Movements whose amounts verifiably account for `difference`: one movement
 * of the same size (EXACT), of half the size (SIGN_INVERTED: registered with
 * the wrong sign), or two movements that add up to it (PAIR). Bounded so a
 * busy day never explodes the response.
 */
export function explainDifference(
  difference: number,
  candidates: CandidateMovement[],
  limit = 10,
): RelatedMovement[] {
  const target = Math.abs(cents(difference));
  if (target < EPSILON) {
    return [];
  }
  const found: RelatedMovement[] = [];
  const seen = new Set<string>();
  const push = (
    candidate: CandidateMovement,
    match: MatchKind,
    pairWithId?: string,
  ) => {
    const key = `${candidate.id}:${match}:${pairWithId ?? ''}`;
    if (!seen.has(key) && found.length < limit) {
      seen.add(key);
      found.push({ ...candidate, match, pairWithId });
    }
  };
  for (const candidate of candidates) {
    const size = Math.abs(cents(candidate.amount));
    if (Math.abs(size - target) < EPSILON) {
      push(candidate, 'EXACT');
    } else if (Math.abs(size * 2 - target) < EPSILON) {
      push(candidate, 'SIGN_INVERTED');
    }
  }
  const pool = candidates.filter((c) => !isZero(c.amount)).slice(0, 150);
  for (let i = 0; i < pool.length && found.length < limit; i++) {
    for (let j = i + 1; j < pool.length && found.length < limit; j++) {
      const sum = Math.abs(cents(pool[i].amount + pool[j].amount));
      if (Math.abs(sum - target) < EPSILON) {
        push(pool[i], 'PAIR', pool[j].id);
        push(pool[j], 'PAIR', pool[i].id);
      }
    }
  }
  return found;
}

/** Same-size movements dated the previous/next day: possibly registered on the wrong date. */
function adjacentMatches(
  difference: number,
  data: FinancialDayRawData,
  filter: (source: string, bankId: string | null) => boolean,
): RelatedMovement[] {
  const target = Math.abs(cents(difference));
  return data.adjacentMovements
    .filter((m) => filter(m.source, m.bankId))
    .filter((m) => Math.abs(Math.abs(cents(m.amount)) - target) < EPSILON)
    .slice(0, 5)
    .map((m) => ({
      source: m.source,
      id: m.id,
      label: m.label,
      amount: m.amount,
      date: m.date,
      match: 'ADJACENT_DAY' as const,
    }));
}

// ── Output shapes ───────────────────────────────────────────────────────────

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
  /** Where the difference can be corrected from the review (if it can). */
  target: {
    kind: 'SNAPSHOT' | 'INFO';
    target?: string;
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
  totals: Record<BankMovementCategory, number>;
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
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  actualStartedAt: Date | null;
  actualFinishedAt: Date | null;
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
    createdAt: Date;
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

export interface PortfolioClientDiagnosis {
  clientId: string;
  clientName: string;
  opening: number;
  charges: number;
  payments: number;
  settlements: number;
  reviewAdjustments: number;
  closing: number;
}

export interface PortfolioDiagnosis {
  clients: PortfolioClientDiagnosis[];
  totals: Omit<PortfolioClientDiagnosis, 'clientId' | 'clientName'>;
  rows: Array<
    PortfolioRowRaw & {
      adjustment: { correctedAmount: number; delta: number } | null;
    }
  >;
  registeredTotal: number | null;
  difference: number | null;
  lateRows: PortfolioLateRowRaw[];
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
  createdAt: Date | null;
  username: string | null;
  rowsForDate: number;
  expectedBanks: number | null;
  /**
   * Same sum with BI Club subtracted like any other credit line — the rule in
   * force before the BI Club debt model (migration 1760006000000). A stored
   * total that matches it was correct for its time, not a difference.
   */
  expectedBanksPreviousRule: number | null;
  missingBankSnapshots: string[];
  expectedAccountsReceivable: number;
  expectedAssets: number;
  expectedCash: number | null;
}

export interface DayMovementView {
  source: MovementSource;
  id: string;
  at: Date;
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
  agentDay: FinancialDayRawData['agentDay'];
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
  movements: DayMovementView[];
  differences: DifferenceItem[];
  totalAbsoluteDifference: number;
  hasPendingDifferences: boolean;
}

// ── Builders ────────────────────────────────────────────────────────────────

function adjustmentEffects(adjustments: AdjustmentRaw[]) {
  const cash = cents(
    adjustments
      .flatMap((a) => a.effects)
      .filter((e) => e.scope === 'CASH')
      .reduce((s, e) => s + e.amount, 0),
  );
  const bank = new Map<string, number>();
  const ar = new Map<string, number>();
  const asset = new Map<string, number>();
  for (const effect of adjustments.flatMap((a) => a.effects)) {
    if (effect.scope === 'BANK' && effect.bankId) {
      bank.set(
        effect.bankId,
        cents((bank.get(effect.bankId) ?? 0) + effect.amount),
      );
    } else if (effect.scope === 'AR' && effect.clientId) {
      ar.set(
        effect.clientId,
        cents((ar.get(effect.clientId) ?? 0) + effect.amount),
      );
    } else if (effect.scope === 'ASSET' && effect.clientId) {
      asset.set(
        effect.clientId,
        cents((asset.get(effect.clientId) ?? 0) + effect.amount),
      );
    }
  }
  return { cash, bank, ar, asset };
}

function buildBanks(
  data: FinancialDayRawData,
  bankAdjustments: Map<string, number>,
): BankDiagnosis[] {
  return data.banks.map((bank: DayBankRaw) => {
    const movements = data.bankMovements.filter(
      (m) => m.bankId === bank.bankId,
    );
    const totals: Record<BankMovementCategory, number> = {
      deposits: 0,
      withdrawals: 0,
      transfersIn: 0,
      transfersOut: 0,
      disbursements: 0,
      payments: 0,
      reimbursements: 0,
      adjustments: 0,
    };
    for (const movement of movements) {
      const category = bankMovementCategory(movement.movementType);
      totals[category] = cents(totals[category] + movement.amount);
    }
    const movementsTotal = cents(movements.reduce((s, m) => s + m.amount, 0));
    const reviewAdjustments = bankAdjustments.get(bank.bankId) ?? 0;
    // The ledger can only verify a day it already existed for.
    const ledgerAvailable =
      !!bank.firstLedgerDate && bank.firstLedgerDate <= data.date;
    const opening = bank.previousBalance;
    const theoreticalClosing =
      ledgerAvailable && opening !== null
        ? cents(opening + movementsTotal + reviewAdjustments)
        : null;
    const registeredClosing = bank.finalBalance;
    return {
      bankId: bank.bankId,
      name: bank.name,
      maskedAccount: maskAccountNumber(bank.accountNumber),
      specialAccount: bank.specialAccount,
      accountTypeName: bank.accountTypeName,
      creditLine: isCreditLineType(bank.accountTypeName, bank.specialAccount),
      outsideReconciliation: bank.specialAccount === 'GUAYACAN',
      balanceRowId: bank.balanceRowId,
      openingRegistered: opening,
      previousDayDate: bank.previousDayDate,
      previousDayFinal: bank.previousDayFinal,
      openingMismatch:
        opening !== null && bank.previousDayFinal !== null
          ? cents(opening - bank.previousDayFinal)
          : null,
      ledgerAvailable,
      ledgerOpening: bank.ledgerOpening,
      totals,
      reviewAdjustments,
      movementsTotal,
      theoreticalClosing,
      registeredClosing,
      difference:
        theoreticalClosing !== null && registeredClosing !== null
          ? cents(registeredClosing - theoreticalClosing)
          : null,
      nextDayDate: bank.nextDayDate,
      nextDayOpening: bank.nextDayPrevious,
      nextDayMismatch:
        registeredClosing !== null && bank.nextDayPrevious !== null
          ? cents(bank.nextDayPrevious - registeredClosing)
          : null,
      movementCount: movements.length,
    };
  });
}

function signedCash(direction: string, amount: number): number {
  return direction === 'IN' ? amount : direction === 'OUT' ? -amount : 0;
}

function buildCash(
  data: FinancialDayRawData,
  cashAdjustment: number,
): CashDiagnosis {
  const day = data.cashDay;
  const totalIn = cents(
    data.cashMovements
      .filter((m) => m.direction === 'IN')
      .reduce((s, m) => s + m.amount, 0),
  );
  const totalOut = cents(
    data.cashMovements
      .filter((m) => m.direction === 'OUT')
      .reduce((s, m) => s + m.amount, 0),
  );
  if (!day) {
    return {
      available: false,
      dayId: null,
      status: null,
      openingPolicy: null,
      openingSystem: null,
      openingPhysical: null,
      previousDayDate: null,
      previousDayClosingPhysical: null,
      openingMismatch: null,
      totalIn,
      totalOut,
      reviewAdjustments: cashAdjustment,
      theoretical: null,
      registeredSystemClosing: null,
      kardexDifference: null,
      counted: null,
      physicalDifference: null,
      registeredClosingDifference: null,
      nextDayDate: null,
      nextDayOpeningPhysical: null,
      nextDayMismatch: null,
      movementCount: data.cashMovements.length,
    };
  }
  const theoretical = cents(
    day.openingSystemCash + totalIn - totalOut + cashAdjustment,
  );
  return {
    available: true,
    dayId: day.id,
    status: day.status,
    openingPolicy: day.openingPolicy,
    openingSystem: day.openingSystemCash,
    openingPhysical: day.openingPhysicalCash,
    previousDayDate: day.previousDayDate,
    previousDayClosingPhysical: day.previousDayClosingPhysical,
    openingMismatch:
      day.previousDayClosingPhysical !== null
        ? cents(day.openingPhysicalCash - day.previousDayClosingPhysical)
        : null,
    totalIn,
    totalOut,
    reviewAdjustments: cashAdjustment,
    theoretical,
    registeredSystemClosing: day.closingSystemCash,
    kardexDifference:
      day.closingSystemCash !== null
        ? cents(day.closingSystemCash - theoretical)
        : null,
    counted: day.closingPhysicalCash,
    physicalDifference:
      day.closingPhysicalCash !== null
        ? cents(day.closingPhysicalCash - theoretical)
        : null,
    registeredClosingDifference: day.closingDifference,
    nextDayDate: day.nextDayDate,
    nextDayOpeningPhysical: day.nextDayOpeningPhysical,
    nextDayMismatch:
      day.closingPhysicalCash !== null && day.nextDayOpeningPhysical !== null
        ? cents(day.nextDayOpeningPhysical - day.closingPhysicalCash)
        : null,
    movementCount: data.cashMovements.length,
  };
}

function buildCuts(data: FinancialDayRawData): CutDiagnosis[] {
  return data.cuts.map((cut) => {
    const current = cut.counts.find((c) => c.isCurrent) ?? null;
    return {
      id: cut.id,
      periodNumber: cut.periodNumber,
      status: cut.status,
      scheduledStartAt: cut.scheduledStartAt,
      scheduledEndAt: cut.scheduledEndAt,
      actualStartedAt: cut.actualStartedAt,
      actualFinishedAt: cut.actualFinishedAt,
      openingSystem: cut.openingSystemCash,
      openingPhysical: cut.openingPhysicalCash,
      closingSystem: cut.closingSystemCash,
      closingPhysical: cut.closingPhysicalCash,
      cashDifference: cut.cashDifference,
      registeredIn: cut.totalIn,
      registeredOut: cut.totalOut,
      recomputedIn: cut.rangeIn,
      recomputedOut: cut.rangeOut,
      movementCount: cut.rangeCount,
      reopenedCount: cut.reopenedCount,
      currentCount: current
        ? {
            id: current.id,
            totalCounted: current.totalCounted,
            systemCash: current.systemCash,
            difference: current.difference,
            username: current.username,
            createdAt: current.createdAt,
          }
        : null,
      previousCounts: cut.counts.filter((c) => !c.isCurrent).length,
      bankReconciliations: cut.bankReconciliations
        .filter((r) => !current || r.countId === current.id)
        .map((r) => ({
          id: r.id,
          bankName: r.bankName,
          systemBalance: r.systemBalance,
          verifiedBalance: r.verifiedBalance,
          difference: r.difference,
        })),
    };
  });
}

function buildPortfolio(
  raw: PortfolioRaw,
  table: 'accounts_receivable' | 'assets',
  effects: Map<string, number>,
  adjustments: AdjustmentRaw[],
  registeredTotal: number | null,
): PortfolioDiagnosis {
  const clients = raw.clients.map((client) => {
    const reviewAdjustments = effects.get(client.clientId) ?? 0;
    return {
      ...client,
      reviewAdjustments,
      closing: cents(
        client.opening +
          client.charges -
          client.payments -
          client.settlements +
          reviewAdjustments,
      ),
    };
  });
  const sum = (pick: (c: PortfolioClientDiagnosis) => number) =>
    cents(clients.reduce((s, c) => s + pick(c), 0));
  const totals = {
    opening: sum((c) => c.opening),
    charges: sum((c) => c.charges),
    payments: sum((c) => c.payments),
    settlements: sum((c) => c.settlements),
    reviewAdjustments: sum((c) => c.reviewAdjustments),
    closing: sum((c) => c.closing),
  };
  const bySource = new Map(
    adjustments
      .filter((a) => a.sourceTable === table)
      .map((a) => [a.sourceId, a]),
  );
  return {
    clients,
    totals,
    rows: raw.rows.map((row) => {
      const adjustment = bySource.get(row.id);
      return {
        ...row,
        adjustment: adjustment
          ? {
              correctedAmount: adjustment.correctedAmount,
              delta: adjustment.delta,
            }
          : null,
      };
    }),
    registeredTotal,
    difference:
      registeredTotal !== null ? cents(registeredTotal - totals.closing) : null,
    lateRows: raw.lateRows,
  };
}

function buildMovements(data: FinancialDayRawData): DayMovementView[] {
  const adjustmentFor = (table: string, id: string) => {
    const adjustment = data.adjustments.find(
      (a) => a.sourceTable === table && a.sourceId === id,
    );
    return adjustment
      ? { correctedAmount: adjustment.correctedAmount, delta: adjustment.delta }
      : null;
  };
  const cashFor = (referenceType: string, id: string) =>
    cents(
      data.cashMovements
        .filter(
          (m) =>
            m.referenceType === referenceType &&
            m.referenceId === id &&
            m.movementType !== 'ANULACION',
        )
        .reduce((s, m) => s + signedCash(m.direction, m.amount), 0),
    );
  const views: DayMovementView[] = [];

  for (const tx of data.transactions) {
    const bankRows = data.bankMovements.filter(
      (m) =>
        m.referenceType === 'BANK_DEPOSIT' &&
        m.referenceId === tx.id &&
        m.movementType !== 'ANULACION',
    );
    views.push({
      source: 'TRANSACTION',
      id: tx.id,
      at: tx.createdAt,
      type: tx.typeName ?? 'Transacción',
      label: [tx.typeName, tx.description, tx.agentBankName, tx.clientName]
        .filter(Boolean)
        .join(' — '),
      amount: tx.totalAmount,
      account: tx.bankAccountName ?? tx.agentBankName,
      cashEffect: cashFor('BANK_DEPOSIT', tx.id),
      bankEffect: cents(bankRows.reduce((s, m) => s + m.amount, 0)),
      balanceBefore: bankRows[0]?.balanceBefore ?? null,
      balanceAfter: bankRows[0]?.balanceAfter ?? null,
      reference: `${tx.transactionCount} transacción(es)`,
      username: tx.username,
      status: tx.isVoided ? 'ANULADO' : 'VIGENTE',
      adjustable: !tx.isVoided,
      adjustment: adjustmentFor('bank_deposit_operations', tx.id),
    });
  }
  for (const m of data.bankMovements) {
    if (m.referenceType === 'BANK_DEPOSIT') {
      continue; // shown inside its Transaccionar operation
    }
    views.push({
      source: 'BANK_MOVEMENT',
      id: m.id,
      at: m.createdAt,
      type: m.movementType,
      label: m.concept ?? m.movementType,
      amount: Math.abs(m.amount),
      account: m.bankName,
      cashEffect: cents(
        data.cashMovements
          .filter(
            (c) =>
              c.movementType !== 'ANULACION' &&
              ((c.referenceType === 'BANK_MOVEMENT' &&
                c.referenceId === m.id) ||
                (!!m.referenceType &&
                  c.referenceType === m.referenceType &&
                  c.referenceId === m.referenceId)),
          )
          .reduce((s, c) => s + signedCash(c.direction, c.amount), 0),
      ),
      bankEffect: m.amount,
      balanceBefore: m.balanceBefore,
      balanceAfter: m.balanceAfter,
      reference: m.referenceText ?? `#${m.sequence}`,
      username: m.username,
      status: m.status === 'ANULADO' ? 'ANULADO' : 'VIGENTE',
      adjustable: m.status === 'APLICADO' && m.movementType !== 'ANULACION',
      adjustment: adjustmentFor('bank_account_movements', m.id),
    });
  }
  for (const m of data.cashMovements) {
    if (m.referenceType) {
      continue; // shown inside its source operation
    }
    views.push({
      source: 'CASH_MOVEMENT',
      id: m.id,
      at: m.createdAt,
      type: m.movementType,
      label: m.description,
      amount: m.amount,
      account: 'Efectivo',
      cashEffect: signedCash(m.direction, m.amount),
      bankEffect: 0,
      balanceBefore: m.previousBalance,
      balanceAfter: m.newBalance,
      reference: `Kardex #${m.sequence}`,
      username: m.username,
      status: m.status === 'ANULADO' ? 'ANULADO' : 'VIGENTE',
      adjustable: m.status === 'VIGENTE' && m.movementType !== 'ANULACION',
      adjustment: adjustmentFor('cash_movements', m.id),
    });
  }
  const portfolio = (
    rows: PortfolioRowRaw[],
    source: 'ACCOUNT_RECEIVABLE' | 'ASSET',
  ) => {
    for (const row of rows) {
      views.push({
        source,
        id: row.id,
        at: row.createdAt,
        type: `${row.movementType} ${source === 'ASSET' ? 'Activo' : 'CxC'}`,
        label: [row.clientName, row.description].filter(Boolean).join(' — '),
        amount: row.amount,
        account: row.clientName,
        cashEffect: cashFor(source, row.id),
        bankEffect: 0,
        balanceBefore: null,
        balanceAfter: null,
        reference: `#${row.sequence}`,
        username: row.username,
        status: row.isActive ? 'VIGENTE' : 'ANULADO',
        adjustable: row.isActive,
        adjustment: adjustmentFor(
          source === 'ASSET' ? 'assets' : 'accounts_receivable',
          row.id,
        ),
      });
    }
  };
  portfolio(data.receivables.rows, 'ACCOUNT_RECEIVABLE');
  portfolio(data.assets.rows, 'ASSET');
  return views.sort((a, b) => a.at.getTime() - b.at.getTime());
}

function buildReconciliation(
  data: FinancialDayRawData,
  banks: BankDiagnosis[],
  receivables: PortfolioDiagnosis,
  assets: PortfolioDiagnosis,
  cash: CashDiagnosis,
): ReconciliationDiagnosis {
  const rec = data.reconciliation;
  const included = banks.filter(
    (b) =>
      !b.outsideReconciliation &&
      (b.balanceRowId || b.registeredClosing !== null),
  );
  const missing = banks
    .filter((b) => !b.outsideReconciliation && !b.balanceRowId)
    .map((b) => b.name);
  const expectedBanks = included.length
    ? cents(
        included.reduce(
          (s, b) => s + (b.creditLine ? -1 : 1) * (b.registeredClosing ?? 0),
          0,
        ),
      )
    : null;
  const expectedBanksPreviousRule = included.length
    ? cents(
        included.reduce(
          (s, b) =>
            s +
            (b.creditLine || b.specialAccount === 'BI_CLUB' ? -1 : 1) *
              (b.registeredClosing ?? 0),
          0,
        ),
      )
    : null;
  return {
    available: !!rec,
    id: rec?.id ?? null,
    totalCash: rec?.totalCash ?? null,
    totalBanks: rec?.totalBanks ?? null,
    totalAssets: rec?.totalAssets ?? null,
    totalAccountsReceivable: rec?.totalAccountsReceivable ?? null,
    result: rec?.result ?? null,
    recomputedResult: rec
      ? cents(
          rec.totalCash +
            rec.totalBanks +
            rec.totalAccountsReceivable -
            rec.totalAssets,
        )
      : null,
    createdAt: rec?.createdAt ?? null,
    username: rec?.username ?? null,
    rowsForDate: rec?.rowsForDate ?? 0,
    expectedBanks,
    expectedBanksPreviousRule,
    missingBankSnapshots: missing,
    expectedAccountsReceivable: receivables.totals.closing,
    expectedAssets: assets.totals.closing,
    expectedCash: cash.counted,
  };
}

function lateRelated(
  rows: PortfolioLateRowRaw[],
  source: 'ACCOUNT_RECEIVABLE' | 'ASSET',
): RelatedMovement[] {
  return rows.slice(0, 15).map((row) => ({
    source,
    id: row.id,
    label: `${row.kind === 'CREATED_AFTER_CLOSE' ? 'Registrado después del cierre' : row.kind === 'DEACTIVATED_AFTER_CLOSE' ? 'Desactivado después del cierre' : 'Fecha posterior registrada antes del cierre'} — ${row.clientName}`,
    amount: row.movementType === 'ABONO' ? -row.amount : row.amount,
    date: row.date,
    match: 'LATE_ROW' as const,
  }));
}

function buildDifferences(
  data: FinancialDayRawData,
  banks: BankDiagnosis[],
  cash: CashDiagnosis,
  cuts: CutDiagnosis[],
  receivables: PortfolioDiagnosis,
  assets: PortfolioDiagnosis,
  reconciliation: ReconciliationDiagnosis,
): DifferenceItem[] {
  const list: DifferenceItem[] = [];
  const add = (item: DifferenceItem) => {
    if (!isZero(item.difference)) {
      list.push({ ...item, difference: cents(item.difference) });
    }
  };

  for (const bank of banks) {
    const candidates: CandidateMovement[] = data.bankMovements
      .filter((m) => m.bankId === bank.bankId)
      .map((m) => ({
        source: 'BANK_MOVEMENT' as const,
        id:
          m.referenceType === 'BANK_DEPOSIT' && m.referenceId
            ? m.referenceId
            : m.id,
        label: `${m.movementType} — ${m.concept ?? m.referenceText ?? '#' + m.sequence}`,
        amount: m.amount,
        date: data.date,
      }))
      .map((c) =>
        data.transactions.some((t) => t.id === c.id)
          ? { ...c, source: 'TRANSACTION' as const }
          : c,
      );
    if (bank.difference !== null) {
      add({
        key: `BANK_CLOSING:${bank.bankId}`,
        module: 'BANCOS',
        account: bank.name,
        type: 'SALDO_FINAL_NO_CUADRA',
        label: 'Saldo final registrado ≠ saldo inicial + movimientos del día',
        expected: bank.theoreticalClosing ?? 0,
        registered: bank.registeredClosing ?? 0,
        difference: bank.difference,
        related: [
          ...explainDifference(bank.difference, candidates),
          ...adjacentMatches(
            bank.difference,
            data,
            (s, b) => s === 'BANK_MOVEMENT' && b === bank.bankId,
          ),
        ],
        reference: `bank_balances ${data.date}`,
        target: bank.balanceRowId
          ? {
              kind: 'SNAPSHOT',
              target: 'BANK_BALANCE',
              targetId: bank.balanceRowId,
              field: 'final_balance',
            }
          : null,
      });
    }
    if (bank.openingMismatch !== null) {
      add({
        key: `BANK_OPENING:${bank.bankId}`,
        module: 'BANCOS',
        account: bank.name,
        type: 'APERTURA_DISTINTA_AL_CIERRE_ANTERIOR',
        label: `Saldo inicial ≠ saldo final del ${bank.previousDayDate}`,
        expected: bank.previousDayFinal ?? 0,
        registered: bank.openingRegistered ?? 0,
        difference: bank.openingMismatch,
        related: [],
        reference: `bank_balances ${bank.previousDayDate} → ${data.date}`,
        target: bank.balanceRowId
          ? {
              kind: 'SNAPSHOT',
              target: 'BANK_BALANCE',
              targetId: bank.balanceRowId,
              field: 'previous_balance',
            }
          : null,
      });
    }
    if (bank.nextDayMismatch !== null) {
      add({
        key: `BANK_NEXT:${bank.bankId}`,
        module: 'BANCOS',
        account: bank.name,
        type: 'DIA_SIGUIENTE_ABRE_DISTINTO',
        label: `El ${bank.nextDayDate} abrió con un saldo distinto al cierre de este día (no se modifica)`,
        expected: bank.registeredClosing ?? 0,
        registered: bank.nextDayOpening ?? 0,
        difference: bank.nextDayMismatch,
        related: [],
        reference: `bank_balances ${data.date} → ${bank.nextDayDate}`,
        target: { kind: 'INFO' },
      });
    }
  }

  if (cash.available) {
    const cashCandidates: CandidateMovement[] = data.cashMovements.map((m) => ({
      source: 'CASH_MOVEMENT' as const,
      id: m.id,
      label: `${m.movementType} — ${m.description}`,
      amount: signedCash(m.direction, m.amount),
      date: data.date,
    }));
    if (cash.kardexDifference !== null) {
      add({
        key: 'CASH_KARDEX',
        module: 'EFECTIVO',
        account: 'Efectivo',
        type: 'KARDEX_NO_CUADRA',
        label: 'Saldo de sistema al cierre ≠ apertura + entradas − salidas',
        expected: cash.theoretical ?? 0,
        registered: cash.registeredSystemClosing ?? 0,
        difference: cash.kardexDifference,
        related: explainDifference(cash.kardexDifference, cashCandidates),
        reference: `cash_operational_days ${data.date}`,
        target: { kind: 'INFO' },
      });
    }
    if (cash.physicalDifference !== null) {
      add({
        key: 'CASH_PHYSICAL',
        module: 'EFECTIVO',
        account: 'Efectivo',
        type: 'ARQUEO_CON_DIFERENCIA',
        label: 'Efectivo contado al cierre ≠ efectivo teórico',
        expected: cash.theoretical ?? 0,
        registered: cash.counted ?? 0,
        difference: cash.physicalDifference,
        related: [
          ...explainDifference(cash.physicalDifference, cashCandidates),
          ...adjacentMatches(
            cash.physicalDifference,
            data,
            (s) => s === 'CASH_MOVEMENT',
          ),
        ],
        reference: `cash_operational_days ${data.date}`,
        target: cash.dayId
          ? {
              kind: 'SNAPSHOT',
              target: 'CASH_DAY',
              targetId: cash.dayId,
              field: 'closing_physical_cash',
            }
          : null,
      });
    }
    if (cash.openingMismatch !== null) {
      add({
        key: 'CASH_OPENING',
        module: 'EFECTIVO',
        account: 'Efectivo',
        type: 'APERTURA_DISTINTA_AL_CIERRE_ANTERIOR',
        label: `Efectivo inicial ≠ efectivo contado al cierre del ${cash.previousDayDate}`,
        expected: cash.previousDayClosingPhysical ?? 0,
        registered: cash.openingPhysical ?? 0,
        difference: cash.openingMismatch,
        related: [],
        reference: `cash_operational_days ${cash.previousDayDate} → ${data.date}`,
        target: cash.dayId
          ? {
              kind: 'SNAPSHOT',
              target: 'CASH_DAY',
              targetId: cash.dayId,
              field: 'opening_physical_cash',
            }
          : null,
      });
    }
  }

  for (const cut of cuts) {
    const name = `Corte ${cut.periodNumber}`;
    if (cut.registeredIn !== null && cut.registeredOut !== null) {
      add({
        key: `CUT_TOTALS:${cut.id}`,
        module: 'CORTES',
        account: name,
        type: 'TOTALES_DEL_CORTE_NO_CUADRAN',
        label:
          'Entradas − salidas guardadas ≠ movimientos del Kardex en el rango del corte',
        expected: cents(cut.recomputedIn - cut.recomputedOut),
        registered: cents(cut.registeredIn - cut.registeredOut),
        difference: cents(
          cut.registeredIn -
            cut.registeredOut -
            (cut.recomputedIn - cut.recomputedOut),
        ),
        related: [],
        reference: `cash_cut_periods #${cut.periodNumber}`,
        target: { kind: 'INFO' },
      });
    }
    if (cut.currentCount) {
      add({
        key: `CUT_COUNT:${cut.id}`,
        module: 'CORTES',
        account: name,
        type: 'ARQUEO_CON_DIFERENCIA',
        label: 'Arqueo del corte ≠ saldo de sistema',
        expected: cut.currentCount.systemCash,
        registered: cut.currentCount.totalCounted,
        difference: cut.currentCount.difference,
        related: [],
        reference: `cash_cut_counts ${cut.currentCount.id}`,
        target: {
          kind: 'SNAPSHOT',
          target: 'CASH_CUT_COUNT',
          targetId: cut.currentCount.id,
          field: 'total_counted',
        },
      });
    }
    for (const rec of cut.bankReconciliations) {
      add({
        key: `CUT_BANK:${rec.id}`,
        module: 'CORTES',
        account: `${name} — ${rec.bankName}`,
        type: 'CONCILIACION_CON_DIFERENCIA',
        label: 'Saldo verificado ≠ saldo de sistema',
        expected: rec.systemBalance,
        registered: rec.verifiedBalance,
        difference: rec.difference,
        related: [],
        reference: `cash_cut_bank_reconciliations ${rec.id}`,
        target: {
          kind: 'SNAPSHOT',
          target: 'CASH_BANK_RECONCILIATION',
          targetId: rec.id,
          field: 'verified_balance',
        },
      });
    }
  }
  const [first, second] = [...cuts].sort(
    (a, b) => a.periodNumber - b.periodNumber,
  );
  if (
    first &&
    second &&
    first.closingPhysical !== null &&
    second.openingPhysical !== null
  ) {
    add({
      key: 'CUT_HANDOVER',
      module: 'CORTES',
      account: 'Corte 1 → Corte 2',
      type: 'CORTE_2_ABRE_DISTINTO',
      label:
        'El corte 2 abrió con un efectivo distinto al contado en el corte 1 (decida cuál corregir)',
      expected: first.closingPhysical,
      registered: second.openingPhysical,
      difference: cents(second.openingPhysical - first.closingPhysical),
      related: [],
      reference: 'cash_cut_periods',
      target: {
        kind: 'SNAPSHOT',
        target: 'CASH_CUT_PERIOD',
        targetId: second.id,
        field: 'opening_physical_cash',
      },
    });
  }

  if (reconciliation.available && reconciliation.id) {
    const recId = reconciliation.id;
    add({
      key: 'REC_RESULT',
      module: 'CUADRE',
      account: 'Cuadre de Agentes',
      type: 'RESULTADO_DEL_CUADRE',
      label: 'Resultado del cuadre distinto de cero (cuadre exacto = Q0.00)',
      expected: 0,
      registered: reconciliation.result ?? 0,
      difference: reconciliation.result ?? 0,
      related: [],
      reference: `agent_reconciliations ${recId}`,
      target: { kind: 'INFO' },
    });
    add({
      key: 'REC_FORMULA',
      module: 'CUADRE',
      account: 'Cuadre de Agentes',
      type: 'RESULTADO_MAL_CALCULADO',
      label: 'Resultado guardado ≠ efectivo + bancos + CxC − activos',
      expected: reconciliation.recomputedResult ?? 0,
      registered: reconciliation.result ?? 0,
      difference:
        (reconciliation.result ?? 0) - (reconciliation.recomputedResult ?? 0),
      related: [],
      reference: `agent_reconciliations ${recId}`,
      target: { kind: 'INFO' },
    });
    const matchesPreviousRule =
      reconciliation.expectedBanksPreviousRule !== null &&
      isZero(
        (reconciliation.totalBanks ?? 0) -
          reconciliation.expectedBanksPreviousRule,
      );
    if (
      reconciliation.expectedBanks !== null &&
      reconciliation.missingBankSnapshots.length === 0 &&
      !matchesPreviousRule
    ) {
      add({
        key: 'REC_BANKS',
        module: 'CUADRE',
        account: 'Total bancos',
        type: 'BANCOS_DISTINTOS_A_LA_FOTO',
        label:
          'Total de bancos del cuadre ≠ suma de los saldos finales del día',
        expected: reconciliation.expectedBanks,
        registered: reconciliation.totalBanks ?? 0,
        difference:
          (reconciliation.totalBanks ?? 0) - reconciliation.expectedBanks,
        related: [],
        reference: `agent_reconciliations / bank_balances ${data.date}`,
        target: {
          kind: 'SNAPSHOT',
          target: 'AGENT_RECONCILIATION',
          targetId: recId,
          field: 'total_banks',
        },
      });
    }
    const arDiff =
      (reconciliation.totalAccountsReceivable ?? 0) -
      reconciliation.expectedAccountsReceivable;
    add({
      key: 'REC_AR',
      module: 'CUENTAS_POR_COBRAR',
      account: 'Total cuentas por cobrar',
      type: 'CXC_DISTINTA_AL_CIERRE',
      label: 'CxC del cuadre ≠ saldo de CxC recalculado al cierre del día',
      expected: reconciliation.expectedAccountsReceivable,
      registered: reconciliation.totalAccountsReceivable ?? 0,
      difference: arDiff,
      related: [
        ...explainDifference(
          arDiff,
          receivables.rows.map((r) => ({
            source: 'ACCOUNT_RECEIVABLE' as const,
            id: r.id,
            label: `${r.movementType} — ${r.clientName}`,
            amount: r.movementType === 'ABONO' ? -r.amount : r.amount,
            date: r.date,
          })),
        ),
        ...lateRelated(receivables.lateRows, 'ACCOUNT_RECEIVABLE'),
      ],
      reference: `agent_reconciliations ${recId}`,
      target: {
        kind: 'SNAPSHOT',
        target: 'AGENT_RECONCILIATION',
        targetId: recId,
        field: 'total_accounts_receivable',
      },
    });
    const assetDiff =
      (reconciliation.totalAssets ?? 0) - reconciliation.expectedAssets;
    add({
      key: 'REC_ASSETS',
      module: 'ACTIVOS',
      account: 'Total activos',
      type: 'ACTIVOS_DISTINTOS_AL_CIERRE',
      label:
        'Activos del cuadre ≠ saldo de activos recalculado al cierre del día',
      expected: reconciliation.expectedAssets,
      registered: reconciliation.totalAssets ?? 0,
      difference: assetDiff,
      related: [
        ...explainDifference(
          assetDiff,
          assets.rows.map((r) => ({
            source: 'ASSET' as const,
            id: r.id,
            label: `${r.movementType} — ${r.clientName}`,
            amount: r.movementType === 'ABONO' ? -r.amount : r.amount,
            date: r.date,
          })),
        ),
        ...lateRelated(assets.lateRows, 'ASSET'),
      ],
      reference: `agent_reconciliations ${recId}`,
      target: {
        kind: 'SNAPSHOT',
        target: 'AGENT_RECONCILIATION',
        targetId: recId,
        field: 'total_assets',
      },
    });
    if (reconciliation.expectedCash !== null) {
      add({
        key: 'REC_CASH',
        module: 'CUADRE',
        account: 'Efectivo del cuadre',
        type: 'EFECTIVO_DISTINTO_AL_ARQUEO',
        label: 'Efectivo del cuadre ≠ efectivo contado en Control de Efectivo',
        expected: reconciliation.expectedCash,
        registered: reconciliation.totalCash ?? 0,
        difference:
          (reconciliation.totalCash ?? 0) - reconciliation.expectedCash,
        related: [],
        reference: `agent_reconciliations ${recId}`,
        target: {
          kind: 'SNAPSHOT',
          target: 'AGENT_RECONCILIATION',
          targetId: recId,
          field: 'total_cash',
        },
      });
    }
  }
  return list;
}

/** Full diagnosis of one day (recomputed figures, differences and movements). */
export function diagnoseFinancialDay(
  data: FinancialDayRawData,
): FinancialDayDiagnosis {
  const effects = adjustmentEffects(data.adjustments);
  const banks = buildBanks(data, effects.bank);
  const included = banks.filter((b) => !b.outsideReconciliation);
  const bankTotals = {
    opening: cents(
      included.reduce((s, b) => s + (b.openingRegistered ?? 0), 0),
    ),
    movements: cents(
      included.reduce((s, b) => s + b.movementsTotal + b.reviewAdjustments, 0),
    ),
    theoretical: cents(
      included.reduce((s, b) => s + (b.theoreticalClosing ?? 0), 0),
    ),
    registered: cents(
      included.reduce((s, b) => s + (b.registeredClosing ?? 0), 0),
    ),
    difference: cents(included.reduce((s, b) => s + (b.difference ?? 0), 0)),
  };
  const cash = buildCash(data, effects.cash);
  const cuts = buildCuts(data);
  const receivables = buildPortfolio(
    data.receivables,
    'accounts_receivable',
    effects.ar,
    data.adjustments,
    data.reconciliation?.totalAccountsReceivable ?? null,
  );
  const assets = buildPortfolio(
    data.assets,
    'assets',
    effects.asset,
    data.adjustments,
    data.reconciliation?.totalAssets ?? null,
  );
  const reconciliation = buildReconciliation(
    data,
    banks,
    receivables,
    assets,
    cash,
  );
  const differences = buildDifferences(
    data,
    banks,
    cash,
    cuts,
    receivables,
    assets,
    reconciliation,
  );
  // The next day's opening belongs to that other day: shown, never counted as pending here.
  const actionable = differences.filter(
    (d) => d.type !== 'DIA_SIGUIENTE_ABRE_DISTINTO',
  );
  const totalAbsoluteDifference = cents(
    actionable.reduce((s, d) => s + Math.abs(d.difference), 0),
  );
  return {
    date: data.date,
    agentDay: data.agentDay,
    banks,
    bankTotals,
    cash,
    cuts,
    receivables,
    assets,
    reconciliation,
    movements: buildMovements(data),
    differences,
    totalAbsoluteDifference,
    hasPendingDifferences: totalAbsoluteDifference >= 0.01,
  };
}

/** The photograph stored in the session at open (before) and close (after). */
export function photographOf(data: FinancialDayRawData): PhotographSummary {
  const diagnosis = diagnoseFinancialDay(data);
  return {
    snapshot: {
      date: diagnosis.date,
      takenAt: new Date().toISOString(),
      banks: diagnosis.banks.map((b) => ({
        bankId: b.bankId,
        name: b.name,
        opening: b.openingRegistered,
        theoreticalClosing: b.theoreticalClosing,
        registeredClosing: b.registeredClosing,
        difference: b.difference,
      })),
      bankTotals: diagnosis.bankTotals,
      cash: {
        opening: diagnosis.cash.openingPhysical,
        theoretical: diagnosis.cash.theoretical,
        counted: diagnosis.cash.counted,
        difference: diagnosis.cash.physicalDifference,
      },
      cuts: diagnosis.cuts.map((c) => ({
        periodNumber: c.periodNumber,
        closingSystem: c.closingSystem,
        closingPhysical: c.closingPhysical,
        cashDifference: c.cashDifference,
      })),
      receivables: {
        expected: diagnosis.receivables.totals.closing,
        registered: diagnosis.receivables.registeredTotal,
      },
      assets: {
        expected: diagnosis.assets.totals.closing,
        registered: diagnosis.assets.registeredTotal,
      },
      reconciliation: {
        totalCash: diagnosis.reconciliation.totalCash,
        totalBanks: diagnosis.reconciliation.totalBanks,
        totalAccountsReceivable:
          diagnosis.reconciliation.totalAccountsReceivable,
        totalAssets: diagnosis.reconciliation.totalAssets,
        result: diagnosis.reconciliation.result,
      },
      differences: diagnosis.differences.map((d) => ({
        key: d.key,
        module: d.module,
        account: d.account,
        type: d.type,
        expected: d.expected,
        registered: d.registered,
        difference: d.difference,
      })),
      totalAbsoluteDifference: diagnosis.totalAbsoluteDifference,
    },
    totalDifference: diagnosis.totalAbsoluteDifference,
    hasPendingDifferences: diagnosis.hasPendingDifferences,
  };
}

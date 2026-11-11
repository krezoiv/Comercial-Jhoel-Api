/** Whether `finalBalance` adds to or subtracts from `totalBanks` — decided by the backend from the account type, never re-derived here from `accountTypeName`. */
export type BankBalanceCalculationType = 'sum' | 'subtract';

export interface BankBalanceSummaryItem {
  id: string;
  name: string;
  accountTypeId: string;
  accountTypeName: string;
  finalBalance: number;
  /** Regla especial de la cuenta — `GENESIS` puede tener saldo negativo ("saldo a favor"). */
  specialAccount?: string | null;
  calculationType: BankBalanceCalculationType;
}

/**
 * Cuadre Agentes' first stage — `finalBalance` is the static
 * `banks.final_balance` column (the same one Sistema → Bancos manages),
 * not Agentes Bancarios → Bancos' live daily cuadre. See the backend
 * (`GetCuadreAgentesSummaryUseCase`) for the full reasoning.
 *
 * `totalBanks = totalPositiveAccounts - totalCreditLines` — Ahorro/Monetaria
 * add, Línea de Crédito subtracts. The frontend never reclassifies a bank
 * by its `accountTypeName`; it only displays the totals the backend already
 * computed.
 */
export interface CuadreAgentesSummary {
  banks: BankBalanceSummaryItem[];
  totalBanks: number;
  totalPositiveAccounts: number;
  totalCreditLines: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  /** Cash under Bodega custody — the cuadre is consolidated (caja count + Bodega). */
  totalWarehouseCash: number;
}

/** Fixed bill/coin denominations for the cash count (Q200 … Q0.01) — in display order, same list as the backend. */
export const CASH_DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01] as const;
export type CashDenomination = (typeof CASH_DENOMINATIONS)[number];

/**
 * Count of bills/coins per denomination — always a whole number ≥ 0 (loose
 * coins are counted in their own Q0.50 … Q0.01 rows, so Q1 no longer needs
 * decimals). Never a monetary value on its own — `calculateTotalCash` is
 * what turns it into one.
 */
export type CashCount = Record<CashDenomination, number>;

/** Every denomination takes whole quantities (kept for the `appDecimalInput` binding). */
export function decimalPlacesFor(_denomination: CashDenomination): number {
  return 0;
}

export function createEmptyCashCount(): CashCount {
  return Object.fromEntries(CASH_DENOMINATIONS.map((denomination) => [denomination, 0])) as CashCount;
}

/** Denomination in whole centavos — cash math is done in integers to avoid float drift. */
function toCents(value: number): number {
  return Math.round(value * 100);
}

/** `denomination × quantity` of one row, exact to the centavo. */
export function denominationSubtotal(denomination: number, quantity: number): number {
  return (toCents(denomination) * (quantity || 0)) / 100;
}

/** `denomination × count`, summed across every denomination — the "Total Efectivo" (integer centavo math). */
export function calculateTotalCash(counts: CashCount): number {
  const cents = CASH_DENOMINATIONS.reduce((sum, denomination) => sum + toCents(denomination) * (counts[denomination] || 0), 0);
  return cents / 100;
}

/** Whether any denomination has a quantity entered. */
export function hasAnyQuantity(counts: CashCount): boolean {
  return CASH_DENOMINATIONS.some((denomination) => (counts[denomination] || 0) > 0);
}

/** Builds a full count from stored rows; a denomination missing in the rows (e.g. Q0.01 in old arqueos) becomes 0. */
export function cashCountFromRows(rows: Array<{ denomination: number; quantity: number }>): CashCount {
  const counts = createEmptyCashCount();
  for (const denomination of CASH_DENOMINATIONS) {
    const row = rows.find((r) => toCents(Number(r.denomination)) === toCents(denomination));
    counts[denomination] = row ? Number(row.quantity) : 0;
  }
  return counts;
}

/** Where the cash breakdown being edited comes from — sent with the cuadre and stored with it. */
export type CuadreCashBreakdownSource = 'MANUAL' | 'ARQUEO_CAJA';

/** The Arqueo de Caja a breakdown was loaded from (reference only — the arqueo itself is never modified). */
export interface LoadedCashCountInfo {
  id: string;
  number: number;
  countedAt: string;
  businessDate: string;
  createdByUsername: string;
  totalCounted: number;
  /** False when the arqueo belongs to an earlier bank day than the cuadre's — the UI warns. */
  isFromReferenceDay: boolean;
}

/** `null` source = manual count; otherwise the loaded arqueo and whether it was edited afterwards. */
export interface CashBreakdownOrigin {
  loadedCount: LoadedCashCountInfo | null;
  modifiedAfterLoad: boolean;
}

/** `GET /cash-control/counts/latest` — the latest valid Arqueo de Caja, with all 12 denominations. */
export interface LatestCashCountResponse {
  count: {
    id: string;
    number: number;
    businessDate: string;
    countedAt: string;
    totalCounted: number;
    createdByUsername: string;
  } | null;
  breakdown: Array<{ denomination: number; quantity: number; subtotal: number }>;
  referenceBusinessDate: string | null;
  isFromReferenceDay: boolean;
}

/**
 * Second stage — the historical record `POST /agent-reconciliations`
 * returns. `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result`
 * are always whatever the backend recomputed and saved at that moment,
 * never what this frontend sent.
 */
export interface AgentReconciliation {
  id: string;
  date: string;
  totalCash: number;
  /** Bodega cash included in the result (0 on cuadres saved before Bodega existed). */
  totalWarehouseCash?: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdAt: string;
  createdByUsername: string;
}

/** `totalCash` is the only thing this frontend actually decides on save — everything else is recomputed by the backend. `date` is the shared Agentes Bancarios operation date (`BankBalanceDraftStore.operationDate`) — the exact same date Bancos used to save balances, never independently guessed as "today" (the backend still defaults to its own today when omitted, but the Cuadre Agentes screen must never omit it, that was the bug). */
export interface RegisterAgentReconciliationInput {
  totalCash: number;
  date?: string;
  /** The breakdown actually used (all denominations) — the backend checks it adds up to `totalCash` and stores it as a photograph. */
  cashDetails?: Array<{ denomination: number; quantity: number }>;
  cashBreakdownSource?: CuadreCashBreakdownSource;
  /** Only with `ARQUEO_CAJA`: the arqueo the breakdown was loaded from. */
  sourceCashCountId?: string;
}

/** Cuadre result = Cash + Banks + AccountsReceivable − Assets. Red if <0, green if =0, yellow if >0. */
export type CuadreResultStatus = 'negative' | 'zero' | 'positive';

export function getCuadreResultStatus(result: number): CuadreResultStatus {
  if (result < 0) {
    return 'negative';
  }
  if (result > 0) {
    return 'positive';
  }
  return 'zero';
}

/** `Cash + Banks + AccountsReceivable − Assets` — the same formula the backend recomputes and never trusts from the client on save. */
/** Consolidated cuadre (same formula as the backend): caja count + Bodega + banks + CxC − assets. */
export function calculateCuadreResult(
  totalCash: number,
  totalBanks: number,
  totalAccountsReceivable: number,
  totalAssets: number,
  totalWarehouseCash = 0,
): number {
  return totalCash + totalWarehouseCash + totalBanks + totalAccountsReceivable - totalAssets;
}

export interface MissingBankInfo {
  id: string;
  name: string;
}

/**
 * Answers "were this date's bank balances saved [in Agentes Bancarios →
 * Bancos]?" — never "does the bank have a current balance?". This is the
 * rule that blocks "Guardar Cuadre" until a daily cuadre is saved for
 * that same date; the backend (`CreateAgentReconciliationUseCase`)
 * enforces this again independently on save, so this frontend check is
 * UX only.
 */
export interface BankBalancesValidation {
  date: string;
  canReconcile: boolean;
  totalActiveBanks: number;
  banksWithBalance: number;
  missingBanks: MissingBankInfo[];
}

/**
 * The questions of the mandatory "Apertura → Saldos → Cuadre → Cierre"
 * sequence:
 * 1. Is it open? → `isOpened`.
 * 2. Were bank balances already saved? → `bankBalancesSaved`.
 * 3. Can Cuadre Agentes be entered? → `canAccessReconciliation`.
 * 4. Was the cuadre already done? → `reconciliationCompleted` (informational — see `status`).
 * 5. Was the day already closed? → `isClosed`.
 *
 * `canAccessReconciliation` is the only thing that gates the sidebar and
 * Cuadre Agentes' actual content; the backend (`CloseAgentDayUseCase`)
 * enforces `isOpened`/`bankBalancesSaved`/`!isClosed` again independently
 * on save, so this frontend check is UX only. `canAccessReconciliation`
 * is already `false` once `isClosed` is `true` — "Guardar Cuadre" closes
 * the day in the same operation, so there's no need to check `isClosed`
 * separately to block a second cuadre.
 */
export type DayWorkStatus =
  | 'NOT_OPENED'
  | 'OPENED'
  | 'BANK_BALANCES_SAVED'
  | 'RECONCILIATION_COMPLETED'
  | 'CLOSED'
  | 'REOPENED'
  | 'CANCELLED';

export interface DayStatus {
  date: string;
  status: DayWorkStatus;
  isOpened: boolean;
  bankBalancesSaved: boolean;
  canAccessReconciliation: boolean;
  reconciliationCompleted: boolean;
  isClosed: boolean;
  isCancelled: boolean;
}

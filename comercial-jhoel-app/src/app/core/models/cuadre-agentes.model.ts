/** Si `finalBalance` suma o resta en `totalBanks` — decidido por el backend según el tipo de cuenta, nunca re-derivado aquí desde `accountTypeName`. */
export type BankBalanceCalculationType = 'sum' | 'subtract';

export interface BankBalanceSummaryItem {
  id: string;
  name: string;
  accountTypeId: string;
  accountTypeName: string;
  finalBalance: number;
  calculationType: BankBalanceCalculationType;
}

/**
 * Primera etapa de Cuadre Agentes — `finalBalance` es la columna estática
 * `banks.final_balance` (la misma que Sistema → Bancos administra), no el
 * cuadre diario en vivo de Agentes Bancarios → Bancos. Ver el backend
 * (`GetCuadreAgentesSummaryUseCase`) para el razonamiento completo.
 *
 * `totalBanks = totalPositiveAccounts - totalCreditLines` — Ahorro/Monetaria
 * suman, Línea de Crédito resta. El frontend nunca reclasifica un banco por
 * su `accountTypeName`; solo muestra los totales que el backend ya calculó.
 */
export interface CuadreAgentesSummary {
  banks: BankBalanceSummaryItem[];
  totalBanks: number;
  totalPositiveAccounts: number;
  totalCreditLines: number;
  totalAssets: number;
  totalAccountsReceivable: number;
}

/** Denominaciones fijas de billetes/monedas para el conteo de efectivo — en el orden en que deben mostrarse. */
export const CASH_DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1] as const;
export type CashDenomination = (typeof CASH_DENOMINATIONS)[number];

/**
 * Cantidad de billetes/monedas por denominación — entero ≥ 0 para Q200–Q5;
 * Q1 es la única excepción (segunda etapa) y puede llevar hasta 2 decimales,
 * ya que suele contarse en monedas fraccionarias sueltas. Nunca es en sí un
 * valor monetario — `calculateTotalCash` es lo que lo convierte en uno.
 */
export type CashCount = Record<CashDenomination, number>;

/** Q1 es la única denominación que acepta decimales — ver el comentario de `CashCount`. */
export function decimalPlacesFor(denomination: CashDenomination): number {
  return denomination === 1 ? 2 : 0;
}

export function createEmptyCashCount(): CashCount {
  return Object.fromEntries(CASH_DENOMINATIONS.map((denomination) => [denomination, 0])) as CashCount;
}

/** `denominación × cantidad`, sumado en todas las denominaciones — el "Total Efectivo". */
export function calculateTotalCash(counts: CashCount): number {
  return CASH_DENOMINATIONS.reduce((sum, denomination) => sum + denomination * (counts[denomination] || 0), 0);
}

/**
 * Segunda etapa — el registro histórico que devuelve `POST /agent-reconciliations`.
 * `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` son siempre los que
 * el backend recalculó y guardó en ese momento, nunca los que este frontend envió.
 */
export interface AgentReconciliation {
  id: string;
  date: string;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdAt: string;
  createdByUsername: string;
}

/** Lo único que este frontend realmente decide al guardar — todo lo demás lo recalcula el backend. */
export interface RegisterAgentReconciliationInput {
  totalCash: number;
}

/** Resultado del Cuadre = Efectivo + Bancos + CuentasPorCobrar − Activos. Rojo si <0, verde si =0, amarillo si >0. */
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

/** `Efectivo + Bancos + CuentasPorCobrar − Activos` — la misma fórmula que el backend recalcula y nunca confía del cliente al guardar. */
export function calculateCuadreResult(
  totalCash: number,
  totalBanks: number,
  totalAccountsReceivable: number,
  totalAssets: number,
): number {
  return totalCash + totalBanks + totalAccountsReceivable - totalAssets;
}

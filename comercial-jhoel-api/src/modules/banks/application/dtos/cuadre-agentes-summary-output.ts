/** Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided. Exposed so the frontend never has to re-derive it from `accountTypeName` itself. */
export type BankBalanceCalculationType = 'sum' | 'subtract';

export interface BankBalanceSummaryItem {
  id: string;
  name: string;
  accountTypeId: string;
  accountTypeName: string;
  finalBalance: number;
  calculationType: BankBalanceCalculationType;
}

export interface CuadreAgentesSummaryOutput {
  banks: BankBalanceSummaryItem[];
  /** `totalPositiveAccounts - totalCreditLines` — Ahorro/Monetaria add, Línea de Crédito subtracts. */
  totalBanks: number;
  /** Sum of every non-credit-line bank's `finalBalance` (Ahorro + Monetaria) — the "Cuentas Positivas" breakdown line. */
  totalPositiveAccounts: number;
  /** Sum of every credit-line bank's `finalBalance`, as a positive magnitude (already subtracted in `totalBanks`) — the "Líneas de Crédito" breakdown line. */
  totalCreditLines: number;
  totalAssets: number;
  totalAccountsReceivable: number;
}

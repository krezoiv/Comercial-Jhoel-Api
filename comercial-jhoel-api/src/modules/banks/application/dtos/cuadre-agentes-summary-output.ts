/** Whether this bank's `finalBalance` adds to or subtracts from `totalBanks` — see `isCreditLineAccountType` for how it's decided. Exposed so the frontend never has to re-derive it from `accountTypeName` itself. */
export type BankBalanceCalculationType = 'sum' | 'subtract';

export interface BankBalanceSummaryItem {
  id: string;
  name: string;
  accountTypeId: string;
  accountTypeName: string;
  /** Con su signo real — la línea de crédito de Génesis puede ser negativa ("saldo a favor"). */
  finalBalance: number;
  specialAccount: string | null;
  calculationType: BankBalanceCalculationType;
}

export interface CuadreAgentesSummaryOutput {
  banks: BankBalanceSummaryItem[];
  /** `totalPositiveAccounts - totalCreditLines` — Ahorro/Monetaria add, Línea de Crédito subtracts. */
  totalBanks: number;
  /** Sum of every non-credit-line bank's `finalBalance` (Ahorro + Monetaria) — the "Cuentas Positivas" breakdown line. */
  totalPositiveAccounts: number;
  /** Sum of every credit-line bank's `finalBalance`, with its real sign (already subtracted in `totalBanks`; a negative Génesis "saldo a favor" therefore increases the total) — the "Líneas de Crédito" breakdown line. */
  totalCreditLines: number;
  totalAssets: number;
  totalAccountsReceivable: number;
}

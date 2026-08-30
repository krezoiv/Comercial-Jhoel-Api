export interface MissingBankInfo {
  id: string;
  name: string;
}

/**
 * Answers "¿se guardaron los saldos bancarios de ESTA FECHA?" — never
 * "¿el banco tiene un saldo actual?" (that would be reading `banks.
 * final_balance`, the static reference column, which says nothing about
 * whether *this specific date* was ever registered). Built directly off
 * `BankBalanceRepository.findBalancesView(date)`, the exact same
 * active-banks-plus-daily-entry projection the Agentes Bancarios → Bancos
 * screen itself renders — so "missing" here means precisely
 * `finalBalance === null` for that date, the same signal that screen's
 * own gray placeholder already represents.
 */
export interface BankBalancesValidationOutput {
  date: string;
  canReconcile: boolean;
  totalActiveBanks: number;
  banksWithBalance: number;
  missingBanks: MissingBankInfo[];
}

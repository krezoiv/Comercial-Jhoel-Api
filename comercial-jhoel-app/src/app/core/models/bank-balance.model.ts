import { BankSpecialAccount } from './bank.model';

/** One row of the Agentes Bancarios → Bancos screen: an active bank plus its resolved previous balance and whatever final balance is already saved for the selected date (null if none yet). */
export interface BankBalanceView {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number | null;
  /** Saldo ACTUAL dinámico de la cuenta (independiente de la fecha consultada) — la fuente de verdad es el backend. */
  currentBalance: number;
  specialAccount: BankSpecialAccount | null;
  maxBalance: number | null;
}

export interface SaveBankBalanceEntryInput {
  bankId: string;
  finalBalance: number;
}

export interface SaveBankBalancesInput {
  operationDate: string;
  entries: SaveBankBalanceEntryInput[];
}

export interface SaveBankBalancesResult {
  savedCount: number;
}

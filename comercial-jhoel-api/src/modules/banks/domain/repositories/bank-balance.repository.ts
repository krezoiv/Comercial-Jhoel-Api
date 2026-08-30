import { BankBalanceView } from '../entities/bank-balance-view.entity';

export const BANK_BALANCE_REPOSITORY = Symbol('BANK_BALANCE_REPOSITORY');

export interface SaveBankBalanceEntryData {
  bankId: string;
  finalBalance: number;
}

export interface SaveBankBalancesData {
  operationDate: string;
  userId: string;
  entries: SaveBankBalanceEntryData[];
}

export interface BankBalanceRepository {
  /** The resolved view the Agentes Bancarios → Bancos screen renders: every active bank plus its previous/final balance for `operationDate`. */
  findBalancesView(operationDate: string): Promise<BankBalanceView[]>;
  /** Invokes `save_bank_balance` once per entry inside a single outer transaction — the whole batch succeeds or fails together. */
  saveBalances(data: SaveBankBalancesData): Promise<number>;
}

import { BankBalanceView } from '../../domain/entities/bank-balance-view.entity';

export interface BankBalanceViewOutput {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number | null;
}

export function toBankBalanceViewOutput(
  view: BankBalanceView,
): BankBalanceViewOutput {
  return { ...view };
}

/**
 * The row shape the Agentes Bancarios → Bancos screen actually needs: one
 * active bank joined with its resolved previous balance for a given date
 * (last bank_balances.finalBalance strictly before that date, falling back
 * to the bank's configured opening previousBalance) and whatever final
 * balance was already saved for that exact date, if any. Not a persisted
 * entity — a read-side projection assembled by the repository.
 */
export interface BankBalanceView {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number | null;
}

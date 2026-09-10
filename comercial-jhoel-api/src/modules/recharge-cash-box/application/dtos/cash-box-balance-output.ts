export interface CashBoxBalanceOutput {
  date: string;
  previousBalance: number;
  incomeToday: number;
  expenseToday: number;
  currentBalance: number;
  detail: {
    salesRecharges: number;
    salesSim: number;
    contributions: number;
    purchasesRecharges: number;
    purchasesSim: number;
    profitWithdrawals: number;
  };
}

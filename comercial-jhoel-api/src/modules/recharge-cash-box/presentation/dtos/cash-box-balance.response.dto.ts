class CashBoxBalanceDetailResponseDto {
  salesRecharges: number;
  salesSim: number;
  contributions: number;
  purchasesRecharges: number;
  purchasesSim: number;
  profitWithdrawals: number;
}

export class CashBoxBalanceResponseDto {
  date: string;
  previousBalance: number;
  incomeToday: number;
  expenseToday: number;
  currentBalance: number;
  detail: CashBoxBalanceDetailResponseDto;
}

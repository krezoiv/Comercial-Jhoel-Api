export class BankDepositMonthlyStatDto {
  month: string;
  label: string;
  transactionCount: number;
}

export class BankDepositYearlyStatsResponseDto {
  year: number;
  months: BankDepositMonthlyStatDto[];
}

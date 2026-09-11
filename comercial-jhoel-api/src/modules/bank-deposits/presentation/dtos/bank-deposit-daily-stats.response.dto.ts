export class BankDepositDailyStatDto {
  date: string;
  transactionCount: number;
}

export class BankDepositDailyStatsResponseDto {
  month: string;
  days: BankDepositDailyStatDto[];
}

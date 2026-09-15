export class BankDepositWeeklyStatDto {
  weekNumber: number;
  label: string;
  startDate: string;
  endDate: string;
  transactionCount: number;
}

export class BankDepositWeeklyStatsResponseDto {
  month: string;
  weeks: BankDepositWeeklyStatDto[];
}

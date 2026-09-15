export class RechargesMonthlyStatDto {
  month: string;
  label: string;
  amount: number;
}

export class RechargesYearlyStatsResponseDto {
  year: number;
  months: RechargesMonthlyStatDto[];
}

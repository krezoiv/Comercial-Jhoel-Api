export class SalesMonthlyStatDto {
  month: string;
  label: string;
  amount: number;
}

export class SalesYearlyStatsResponseDto {
  year: number;
  months: SalesMonthlyStatDto[];
}

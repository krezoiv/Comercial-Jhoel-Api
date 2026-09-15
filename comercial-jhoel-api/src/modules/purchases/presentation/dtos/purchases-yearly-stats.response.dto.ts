export class PurchasesMonthlyStatDto {
  month: string;
  label: string;
  amount: number;
}

export class PurchasesYearlyStatsResponseDto {
  year: number;
  months: PurchasesMonthlyStatDto[];
}

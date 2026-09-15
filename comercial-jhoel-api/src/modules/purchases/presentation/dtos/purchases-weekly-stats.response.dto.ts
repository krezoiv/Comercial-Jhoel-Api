export class PurchasesWeeklyStatDto {
  weekNumber: number;
  label: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export class PurchasesWeeklyStatsResponseDto {
  month: string;
  weeks: PurchasesWeeklyStatDto[];
}

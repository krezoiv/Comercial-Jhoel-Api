export class SalesWeeklyStatDto {
  weekNumber: number;
  label: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export class SalesWeeklyStatsResponseDto {
  month: string;
  weeks: SalesWeeklyStatDto[];
}

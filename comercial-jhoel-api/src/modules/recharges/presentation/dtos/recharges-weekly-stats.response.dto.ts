export class RechargesWeeklyStatDto {
  weekNumber: number;
  label: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export class RechargesWeeklyStatsResponseDto {
  month: string;
  weeks: RechargesWeeklyStatDto[];
}

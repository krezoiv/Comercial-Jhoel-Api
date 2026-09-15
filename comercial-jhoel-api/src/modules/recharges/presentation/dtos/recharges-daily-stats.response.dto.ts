export class RechargesDailyStatDto {
  date: string;
  amount: number;
}

export class RechargesDailyStatsResponseDto {
  month: string;
  days: RechargesDailyStatDto[];
}

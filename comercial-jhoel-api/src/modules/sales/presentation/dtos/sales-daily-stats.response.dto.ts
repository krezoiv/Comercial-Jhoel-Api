export class SalesDailyStatDto {
  date: string;
  amount: number;
}

export class SalesDailyStatsResponseDto {
  month: string;
  days: SalesDailyStatDto[];
}

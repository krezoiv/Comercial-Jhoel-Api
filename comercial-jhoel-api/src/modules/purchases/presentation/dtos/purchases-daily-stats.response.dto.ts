export class PurchasesDailyStatDto {
  date: string;
  amount: number;
}

export class PurchasesDailyStatsResponseDto {
  month: string;
  days: PurchasesDailyStatDto[];
}

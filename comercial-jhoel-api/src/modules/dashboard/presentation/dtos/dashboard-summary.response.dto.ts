export class DashboardPeriodResponseDto {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

export class DashboardDayResponseDto {
  date: string;
  amount: number;
}

export class DashboardDailySeriesResponseDto {
  highestDay: DashboardDayResponseDto | null;
  lowestDay: DashboardDayResponseDto | null;
  total: number;
}

export class DashboardBankResponseDto {
  bankId: string;
  bankName: string;
  transactions: number;
}

export class DashboardBankTransactionsResponseDto {
  totalTransactions: number;
  highestBank: DashboardBankResponseDto | null;
  lowestBank: DashboardBankResponseDto | null;
}

export class DashboardSummaryResponseDto {
  period: DashboardPeriodResponseDto;
  rechargeSales: DashboardDailySeriesResponseDto;
  sales: DashboardDailySeriesResponseDto;
  purchases: { total: number };
  bankTransactions: DashboardBankTransactionsResponseDto;
}

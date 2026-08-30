export interface RechargeSalesSummaryOutput {
  date: string;
  totalClaro: number;
  totalTigo: number;
  totalSales: number;
  /** `null` until a closure has been saved for this date. */
  totalCollected: number | null;
  /** `null` until a closure has been saved for this date — `totalSales - totalCollected` as of the saved closure. */
  difference: number | null;
  savedClosure: boolean;
}

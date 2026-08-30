export type IceCreamReportType = 'sales' | 'purchases';

export interface IceCreamReportRowOutput {
  id: string;
  type: IceCreamReportType;
  date: Date;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  userId: string;
  username: string;
}

export interface IceCreamReportSummaryOutput {
  totalSales: number;
  totalPurchases: number;
  difference: number;
  recordCount: number;
}

import {
  IceCreamSalesReportRow,
  IceCreamSalesReportSummary,
} from '../../domain/repositories/ice-cream-sales-report.repository';

export interface IceCreamSalesReportRowOutput {
  id: string;
  saleId: string;
  date: Date;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  userId: string;
  username: string;
}

export interface IceCreamSalesReportSummaryOutput {
  totalSold: number;
  totalQuantity: number;
  recordCount: number;
  averagePrice: number;
}

export function toIceCreamSalesReportRowOutput(
  row: IceCreamSalesReportRow,
): IceCreamSalesReportRowOutput {
  return { ...row };
}

export function toIceCreamSalesReportSummaryOutput(
  summary: IceCreamSalesReportSummary,
): IceCreamSalesReportSummaryOutput {
  return { ...summary };
}

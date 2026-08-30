import {
  IceCreamPurchasesReportRow,
  IceCreamPurchasesReportSummary,
} from '../../domain/repositories/ice-cream-purchases-report.repository';

export interface IceCreamPurchasesReportRowOutput {
  id: string;
  purchaseId: string;
  date: Date;
  supplierId: string;
  supplierName: string;
  product: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
  userId: string;
  username: string;
}

export interface IceCreamPurchasesReportSummaryOutput {
  totalPurchased: number;
  totalQuantity: number;
  recordCount: number;
  averageCost: number;
}

export function toIceCreamPurchasesReportRowOutput(
  row: IceCreamPurchasesReportRow,
): IceCreamPurchasesReportRowOutput {
  return { ...row };
}

export function toIceCreamPurchasesReportSummaryOutput(
  summary: IceCreamPurchasesReportSummary,
): IceCreamPurchasesReportSummaryOutput {
  return { ...summary };
}

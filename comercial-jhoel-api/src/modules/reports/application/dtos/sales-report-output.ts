import { Sale } from '../../../sales/domain/entities/sale.entity';
import {
  SalesByProductRow,
  SalesReportRow,
  SalesReportSummary,
} from '../../domain/repositories/sales-report.repository';

export interface SalesReportRowOutput {
  id: string;
  saleNumber: string;
  saleDate: Date;
  userId: string;
  username: string;
  itemCount: number;
  total: number;
  invoiceNumber: string | null;
  isVoided: boolean;
}

export function toSalesReportRowOutput(
  row: SalesReportRow,
): SalesReportRowOutput {
  return { ...row };
}

export interface SalesReportSummaryOutput {
  totalAmount: number;
  salesCount: number;
  unitsSold: number;
  averageTicket: number;
}

export function toSalesReportSummaryOutput(
  summary: SalesReportSummary,
): SalesReportSummaryOutput {
  return { ...summary };
}

export interface SalesByProductRowOutput {
  productId: string;
  productName: string;
  sku: string | null;
  quantitySold: number;
  totalRevenue: number;
}

export function toSalesByProductRowOutput(
  row: SalesByProductRow,
): SalesByProductRowOutput {
  return { ...row };
}

export interface SaleReportDetailItemOutput {
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaleReportDetailOutput {
  id: string;
  saleNumber: string;
  saleDate: Date;
  userId: string;
  username: string;
  total: number;
  items: SaleReportDetailItemOutput[];
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/** Folio is derived from the id, not stored — see `SalesReportRow.saleNumber`'s doc comment. */
export function toSaleReportDetailOutput(sale: Sale): SaleReportDetailOutput {
  return {
    id: sale.id,
    saleNumber: `V-${sale.id.slice(0, 8).toUpperCase()}`,
    saleDate: sale.saleDate,
    userId: sale.userId,
    username: sale.username,
    total: sale.total,
    items: sale.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    invoiceNumber: sale.invoiceNumber,
    isVoided: sale.isVoided,
    voidedAt: sale.voidedAt,
    voidedByUsername: sale.voidedByUsername,
    voidReason: sale.voidReason,
  };
}

import { Purchase } from '../../../purchases/domain/entities/purchase.entity';
import {
  PurchasesByProductRow,
  PurchasesReportRow,
  PurchasesReportSummary,
} from '../../domain/repositories/purchases-report.repository';

export interface PurchasesReportRowOutput {
  id: string;
  purchaseNumber: string;
  purchaseDate: Date;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  itemCount: number;
  total: number;
  invoiceNumber: string | null;
  isVoided: boolean;
}

export function toPurchasesReportRowOutput(
  row: PurchasesReportRow,
): PurchasesReportRowOutput {
  return { ...row };
}

export interface PurchasesReportSummaryOutput {
  totalAmount: number;
  purchasesCount: number;
  unitsPurchased: number;
  averagePurchase: number;
}

export function toPurchasesReportSummaryOutput(
  summary: PurchasesReportSummary,
): PurchasesReportSummaryOutput {
  return { ...summary };
}

export interface PurchasesByProductRowOutput {
  productId: string;
  productName: string;
  sku: string | null;
  quantityPurchased: number;
  totalCost: number;
}

export function toPurchasesByProductRowOutput(
  row: PurchasesByProductRow,
): PurchasesByProductRowOutput {
  return { ...row };
}

export interface PurchaseReportDetailItemOutput {
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  total: number;
}

export interface PurchaseReportDetailOutput {
  id: string;
  purchaseNumber: string;
  purchaseDate: Date;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  total: number;
  items: PurchaseReportDetailItemOutput[];
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/** Folio is derived from the id, not stored — see `PurchasesReportRow.purchaseNumber`'s doc comment. */
export function toPurchaseReportDetailOutput(
  purchase: Purchase,
): PurchaseReportDetailOutput {
  return {
    id: purchase.id,
    purchaseNumber: `C-${purchase.id.slice(0, 8).toUpperCase()}`,
    purchaseDate: purchase.purchaseDate,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplierName,
    userId: purchase.userId,
    username: purchase.username,
    total: purchase.total,
    items: purchase.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      costPrice: item.costPrice,
      publicPrice: item.publicPrice,
      total: item.total,
    })),
    invoiceNumber: purchase.invoiceNumber,
    isVoided: purchase.isVoided,
    voidedAt: purchase.voidedAt,
    voidedByUsername: purchase.voidedByUsername,
    voidReason: purchase.voidReason,
  };
}

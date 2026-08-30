export interface Product {
  id: string;
  name: string;
  /** Barcode. Unique among active products — null if the product doesn't have one assigned. */
  sku: string | null;
  /** Category display name — categoryId is what create/update actually send. */
  category: string;
  categoryId: string;
  /** Business/line-of-business display name (Librería, Tienda, Heladería...) — businessId is what create/update actually send. */
  business: string;
  businessId: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/timestamps/category name. */
export interface ProductInput {
  name: string;
  /** Optional — omit or send null to leave/clear it. */
  sku?: string | null;
  categoryId: string;
  businessId: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/** Below this (and above zero) a product is flagged as low stock. */
export const LOW_STOCK_THRESHOLD = 10;

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  'in-stock': 'Disponible',
  'low-stock': 'Stock bajo',
  'out-of-stock': 'Sin stock',
};

/** Single source of truth for stock classification — used by the table, the filters, and the summary cards. */
export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return 'out-of-stock';
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return 'low-stock';
  }
  return 'in-stock';
}

export { formatCurrency, formatQuantity, parseNumericValue } from '../utils/number-format.util';

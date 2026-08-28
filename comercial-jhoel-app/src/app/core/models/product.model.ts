export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — server/mock assigns id and timestamps. */
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

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

/** Formats a price the way this module's UI needs it — e.g. `Q15.00`. */
export function formatCurrency(value: number): string {
  return `Q${value.toFixed(2)}`;
}

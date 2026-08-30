import { Sale } from '../entities/sale.entity';

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface SaleItemData {
  productId: string;
  quantity: number;
}

export interface ConfirmSaleData {
  userId: string;
  items: SaleItemData[];
}

export type SaleSortField = 'saleDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindSalesOptions {
  /** Restricts the listing to one user's own sales (a USER role never sees anyone else's). */
  userId?: string;
  sortBy: SaleSortField;
  sortDirection: SortDirection;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdjustSaleItemData {
  userId: string;
  productId: string;
  /** Change to apply to this product's line quantity — positive reserves more stock, negative releases it. */
  quantityDelta: number;
}

export interface SaleRepository {
  /** Invokes the `confirm_sale` Postgres function — the sale, its details, and the stock decrement all happen atomically inside it. */
  confirmSale(data: ConfirmSaleData): Promise<Sale>;
  findAll(options: FindSalesOptions): Promise<PaginatedResult<Sale>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Sale | null>;
  /** Invokes `adjust_sale_item` — real-time reserve/release against the caller's open receipt. */
  adjustItem(data: AdjustSaleItemData): Promise<Sale>;
  findOpenSaleByUserId(userId: string): Promise<Sale | null>;
  /** Marks the caller's open receipt as CONFIRMED. Throws if there isn't one, or it has no items. */
  confirmOpenSale(userId: string): Promise<Sale>;
  /** Invokes `cancel_open_sale` — restores all reserved stock and discards the receipt. `false` if there was nothing to cancel. */
  cancelOpenSale(userId: string): Promise<boolean>;
}

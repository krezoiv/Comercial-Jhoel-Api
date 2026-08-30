import { Purchase } from '../entities/purchase.entity';

export const PURCHASE_REPOSITORY = Symbol('PURCHASE_REPOSITORY');

export interface PurchaseItemData {
  productId: string;
  quantity: number;
  costPrice: number;
  publicPrice: number;
}

export interface ConfirmPurchaseData {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: PurchaseItemData[];
}

export type PurchaseSortField = 'purchaseDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindPurchasesOptions {
  /** Restricts the listing to one user's own purchases (a USER role never sees anyone else's, same rule as Sales). */
  userId?: string;
  supplierId?: string;
  sortBy: PurchaseSortField;
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

export interface PurchaseRepository {
  /** Invokes the `confirm_purchase` Postgres function — the purchase, its details, the stock increase, and the product price update all happen atomically inside it. */
  confirmPurchase(data: ConfirmPurchaseData): Promise<Purchase>;
  findAll(options: FindPurchasesOptions): Promise<PaginatedResult<Purchase>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Purchase | null>;
}

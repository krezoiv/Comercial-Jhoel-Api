import { IceCreamPurchase } from '../entities/ice-cream-purchase.entity';

export const ICE_CREAM_PURCHASE_REPOSITORY = Symbol(
  'ICE_CREAM_PURCHASE_REPOSITORY',
);

export interface IceCreamPurchaseItemData {
  iceCreamId: string;
  quantity: number;
  costPrice: number;
}

export interface ConfirmIceCreamPurchaseData {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: IceCreamPurchaseItemData[];
}

export type IceCreamPurchaseSortField = 'purchaseDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindIceCreamPurchasesOptions {
  /** Restricts the listing to one user's own purchases (a USER role never sees anyone else's, same rule as Purchases/Sales). */
  userId?: string;
  supplierId?: string;
  sortBy: IceCreamPurchaseSortField;
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

export interface IceCreamPurchaseRepository {
  /** Invokes the `confirm_ice_cream_purchase` Postgres function — the purchase, its details, and the stock/cost-price increase all happen atomically inside it. */
  confirmPurchase(data: ConfirmIceCreamPurchaseData): Promise<IceCreamPurchase>;
  findAll(
    options: FindIceCreamPurchasesOptions,
  ): Promise<PaginatedResult<IceCreamPurchase>>;
  /** Always includes `items` — unlike `findAll`, which never loads them. */
  findById(id: string): Promise<IceCreamPurchase | null>;
}

import { IceCreamSale } from '../entities/ice-cream-sale.entity';

export const ICE_CREAM_SALE_REPOSITORY = Symbol('ICE_CREAM_SALE_REPOSITORY');

export interface IceCreamSaleItemData {
  iceCreamId: string;
  quantity: number;
}

export interface ConfirmIceCreamSaleData {
  userId: string;
  items: IceCreamSaleItemData[];
}

export type IceCreamSaleSortField = 'saleDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindIceCreamSalesOptions {
  /** Restricts the listing to one user's own sales (a USER role never sees anyone else's, same rule as Purchases/Sales). */
  userId?: string;
  sortBy: IceCreamSaleSortField;
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

export interface IceCreamSaleRepository {
  /** Invokes the `confirm_ice_cream_sale` Postgres function — the sale, its details, and the stock decrease all happen atomically inside it, with row-level locking against overselling. */
  confirmSale(data: ConfirmIceCreamSaleData): Promise<IceCreamSale>;
  findAll(
    options: FindIceCreamSalesOptions,
  ): Promise<PaginatedResult<IceCreamSale>>;
  findById(id: string): Promise<IceCreamSale | null>;
}

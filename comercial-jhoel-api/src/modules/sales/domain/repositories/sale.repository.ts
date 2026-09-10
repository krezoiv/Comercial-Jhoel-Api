import { PriceListType } from '../entities/sale.entity';
import { Sale } from '../entities/sale.entity';

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');

export interface SaleItemData {
  productId: string;
  /** Omit to resolve the product's base "Unidad" presentation server-side. */
  presentationId?: string;
  quantity: number;
}

export interface ConfirmSaleData {
  userId: string;
  items: SaleItemData[];
  clientId?: string | null;
  priceList?: PriceListType;
  /** Free-text folio — optional, never enforced as unique. */
  invoiceNumber?: string;
}

export type SaleSortField = 'saleDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';
export type SaleStatusFilter = 'ACTIVE' | 'VOIDED';

export interface FindSalesOptions {
  /** Restricts the listing to one user's own sales (a USER role never sees anyone else's). */
  userId?: string;
  clientId?: string;
  /** `startDate`/`endDate` are `yyyy-MM-dd` — compared against `saleDate`, inclusive on both ends. */
  startDate?: string;
  endDate?: string;
  /** Matches against the client's name OR the sale's own `invoiceNumber`, case-insensitive. */
  search?: string;
  /** Omit to see both active and voided sales — used by the "Administrar Facturas de Ventas" listing, which must always show anuladas too, just clearly flagged. */
  status?: SaleStatusFilter;
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
  /** Omit to resolve the product's base "Unidad" presentation / "Vitrina" location server-side — the live POS UI never sends this yet. */
  presentationId?: string;
  /** Change to apply to this product's line quantity — positive reserves more stock, negative releases it. */
  quantityDelta: number;
  /** Which of the caller's (possibly several) open receipts this targets — see `Sale.draftKey`'s own doc comment. */
  draftKey: string;
}

export interface ConfigureSalePricingData {
  userId: string;
  clientId: string | null;
  priceList: PriceListType;
  draftKey: string;
}

export interface SaleRepository {
  /** Invokes the `confirm_sale` Postgres function — the sale, its details, and the stock decrement all happen atomically inside it. */
  confirmSale(data: ConfirmSaleData): Promise<Sale>;
  findAll(options: FindSalesOptions): Promise<PaginatedResult<Sale>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Sale | null>;
  /** Invokes `adjust_sale_item` — real-time reserve/release against the caller's open receipt identified by `draftKey`. */
  adjustItem(data: AdjustSaleItemData): Promise<Sale>;
  /** Every one of the caller's currently open receipts (any/all tabs) — never just one, since a user can now have several open at once. */
  findOpenSalesByUserId(userId: string): Promise<Sale[]>;
  /** Marks the caller's open receipt identified by `draftKey` as CONFIRMED. Throws if there isn't one, or it has no items. `invoiceNumber` is optional and set via a plain follow-up `UPDATE` — it has no effect on `confirm_open_sale` itself. */
  confirmOpenSale(
    userId: string,
    draftKey: string,
    invoiceNumber?: string,
  ): Promise<Sale>;
  /** Invokes `cancel_open_sale` — restores all reserved stock and discards the receipt identified by `draftKey`. `false` if there was nothing to cancel. */
  cancelOpenSale(userId: string, draftKey: string): Promise<boolean>;
  /** Invokes `configure_open_sale` — sets/updates the client and price list of the receipt identified by `draftKey`. Creates it if it doesn't exist yet. Rejects a price-list change once the receipt has line items. */
  configureOpenSale(data: ConfigureSalePricingData): Promise<Sale>;
  /** Invokes the `void_sale` Postgres function — reverses the exact inventory effect the original CONFIRMED sale applied and marks it `ANULADA`, atomically. Never a physical delete/edit. */
  voidSale(id: string, voidedBy: string, reason: string): Promise<Sale>;
}

import { InventoryStock } from '../entities/inventory-stock.entity';

export const INVENTORY_STOCK_REPOSITORY = Symbol('INVENTORY_STOCK_REPOSITORY');

export interface InitialStockEntry {
  locationId: string;
  quantity: number;
}

export interface LowStockRow {
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  quantity: number;
  minStock: number;
}

export interface InventoryStockRepository {
  /** Every location's row for one product, including locations with zero stock (never omitted — the caller needs to see "Vitrina: 0", not an absent row). */
  findByProductId(productId: string): Promise<InventoryStock[]>;
  /** Bulk variant for a product list/table — one query, not N. */
  findByProductIds(
    productIds: string[],
  ): Promise<Map<string, InventoryStock[]>>;
  /** One-time seeding at product creation — a plain insert, not a stored function, since this runs once in a low-concurrency admin action, not a contested hot path. */
  createInitial(productId: string, entries: InitialStockEntry[]): Promise<void>;
  /** Admin-only correction of a threshold, not a hot path — a plain conditional `UPDATE`, no stored function. Throws if the (product, location) row doesn't exist (shouldn't happen: `createInitial` guarantees every active product has one row per active location). */
  setMinStock(
    productId: string,
    locationId: string,
    minStock: number,
  ): Promise<InventoryStock>;
  /** Every (product, location) row where `quantity <= minStock AND minStock > 0` — `minStock = 0` means "no threshold configured," so it's excluded at the SQL level, never returned as a false "low stock" row. Bounded by construction: only rows already below their own configured threshold, never the full inventory. */
  findLowStock(): Promise<LowStockRow[]>;
}

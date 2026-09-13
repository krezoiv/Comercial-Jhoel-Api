import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export type ProductSortField =
  | 'name'
  | 'costPrice'
  | 'publicPrice'
  | 'wholesalePrice'
  | 'stock'
  | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindProductsOptions {
  activeOnly: boolean;
  search?: string;
  categoryId?: string;
  businessId?: string;
  sortBy: ProductSortField;
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

export interface CreateProductData {
  name: string;
  sku: string | null;
  categoryId: string;
  businessId: string;
  unitOfMeasureId: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
}

export type UpdateProductData = Partial<CreateProductData>;

export interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalPublicValue: number;
  totalCostValue: number;
}

export interface ProductRepository {
  findAll(options: FindProductsOptions): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findByActiveName(name: string): Promise<Product | null>;
  findByActiveSku(sku: string): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  deactivate(id: string): Promise<void>;
  /**
   * Real SQL aggregates over the WHOLE active catalog — never derived by
   * fetching a page of products into the app and summing client-side,
   * which silently truncated at whatever page size the list screen asked
   * for (the exact bug this method replaces: "Total de productos" showing
   * a capped 100 instead of the real count once the catalog grew past the
   * list's own page size). `lowStockCount`/`outOfStockCount` mirror
   * `getStockStatus()`'s own thresholds on the frontend exactly (`stock <=
   * 0` out, `0 < stock <= 10` low) — keep both in sync if that threshold
   * ever changes.
   */
  getInventoryStats(): Promise<InventoryStats>;
}

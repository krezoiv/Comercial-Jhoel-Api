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

export interface ProductRepository {
  findAll(options: FindProductsOptions): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findByActiveName(name: string): Promise<Product | null>;
  findByActiveSku(sku: string): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  deactivate(id: string): Promise<void>;
}

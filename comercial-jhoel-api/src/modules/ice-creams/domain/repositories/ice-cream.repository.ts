import { IceCream } from '../entities/ice-cream.entity';

export const ICE_CREAM_REPOSITORY = Symbol('ICE_CREAM_REPOSITORY');

export type IceCreamSortField =
  'product' | 'sku' | 'costPrice' | 'publicPrice' | 'stock' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindIceCreamsOptions {
  activeOnly: boolean;
  search?: string;
  sortBy: IceCreamSortField;
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

export interface CreateIceCreamData {
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  stock: number;
  createdBy: string;
}

export interface UpdateIceCreamData {
  sku?: string;
  product?: string;
  costPrice?: number;
  publicPrice?: number;
  stock?: number;
  updatedBy: string;
}

export interface IceCreamRepository {
  findAll(options: FindIceCreamsOptions): Promise<PaginatedResult<IceCream>>;
  findById(id: string): Promise<IceCream | null>;
  findByActiveSku(sku: string): Promise<IceCream | null>;
  findByActiveProduct(product: string): Promise<IceCream | null>;
  create(data: CreateIceCreamData): Promise<IceCream>;
  update(id: string, data: UpdateIceCreamData): Promise<IceCream>;
  deactivate(id: string): Promise<void>;
}

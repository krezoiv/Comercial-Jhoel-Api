import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductSortField,
  SortDirection,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../../inventory/domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import {
  ProductOutput,
  toProductOutput,
  withStockByLocation,
} from '../dtos/product-output';

export interface ListProductsInput {
  search?: string;
  categoryId?: string;
  businessId?: string;
  sortBy?: ProductSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface ListProductsOutput {
  items: ProductOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
// The Inventario screen's own toolbar filters/sorts client-side over one
// fetched page rather than driving these query params directly (see the
// frontend's own notes) — a generous default limit is what makes that
// still work today without the frontend needing to paginate through
// multiple requests. `MAX_LIMIT` exists purely as a ceiling against an
// abusive/mistaken client request, not because 100 is otherwise special.
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly stockRepository: InventoryStockRepository,
  ) {}

  async execute(input: ListProductsInput = {}): Promise<ListProductsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.productRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
      categoryId: input.categoryId,
      businessId: input.businessId,
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    const stockByProduct = await this.stockRepository.findByProductIds(
      result.items.map((item) => item.id),
    );

    return {
      items: result.items.map((item) =>
        withStockByLocation(
          toProductOutput(item),
          stockByProduct.get(item.id) ?? [],
        ),
      ),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}

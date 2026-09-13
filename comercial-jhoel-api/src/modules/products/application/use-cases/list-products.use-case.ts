import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductSortField,
  SortDirection,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../../inventory/domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentation } from '../../../inventory/domain/entities/product-presentation.entity';
import {
  ProductOutput,
  toProductOutput,
  withMatchedPresentation,
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
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
  ) {}

  async execute(input: ListProductsInput = {}): Promise<ListProductsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    const search = input.search?.trim() || undefined;

    const result = await this.productRepository.findAll({
      activeOnly: !input.includeInactive,
      search,
      categoryId: input.categoryId,
      businessId: input.businessId,
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    const productIds = result.items.map((item) => item.id);
    const [stockByProduct, matchedPresentationByProduct] = await Promise.all([
      this.stockRepository.findByProductIds(productIds),
      // Only worth a query when there's actually a search term to match a
      // barcode against — an unfiltered list never needs this.
      search
        ? this.presentationRepository.findMatchingByBarcode(productIds, search)
        : Promise.resolve(new Map<string, ProductPresentation>()),
    ]);

    return {
      items: result.items.map((item) => {
        let output = withStockByLocation(
          toProductOutput(item),
          stockByProduct.get(item.id) ?? [],
        );
        const matchedPresentation = matchedPresentationByProduct.get(item.id);
        if (matchedPresentation) {
          output = withMatchedPresentation(output, matchedPresentation);
        }
        return output;
      }),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}

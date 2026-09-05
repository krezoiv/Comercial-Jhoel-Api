import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../../inventory/domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../../inventory/domain/repositories/inventory-stock.repository';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error';
import {
  ProductOutput,
  toProductOutput,
  withStockByLocation,
} from '../dtos/product-output';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly stockRepository: InventoryStockRepository,
  ) {}

  async execute(id: string): Promise<ProductOutput> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    const stock = await this.stockRepository.findByProductId(id);
    return withStockByLocation(toProductOutput(product), stock);
  }
}

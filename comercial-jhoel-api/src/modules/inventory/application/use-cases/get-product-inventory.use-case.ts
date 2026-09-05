import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { INVENTORY_STOCK_REPOSITORY } from '../../domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../domain/repositories/inventory-stock.repository';
import { INVENTORY_MOVEMENT_REPOSITORY } from '../../domain/repositories/inventory-movement.repository';
import type { InventoryMovementRepository } from '../../domain/repositories/inventory-movement.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error';
import {
  ProductInventoryDetailOutput,
  toInventoryMovementOutput,
  toProductPresentationOutput,
  toStockByLocationOutput,
} from '../dtos/inventory-output';

const RECENT_MOVEMENTS_LIMIT = 20;

/** Backs the product detail screen — General/Presentaciones/Inventario/Movimientos recientes, all in one call. */
@Injectable()
export class GetProductInventoryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly stockRepository: InventoryStockRepository,
    @Inject(INVENTORY_MOVEMENT_REPOSITORY)
    private readonly movementRepository: InventoryMovementRepository,
  ) {}

  async execute(productId: string): Promise<ProductInventoryDetailOutput> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    const [presentations, stockByLocation, recentMovements] = await Promise.all(
      [
        this.presentationRepository.findByProductId(productId),
        this.stockRepository.findByProductId(productId),
        this.movementRepository.findByProductId(
          productId,
          RECENT_MOVEMENTS_LIMIT,
        ),
      ],
    );

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      categoryName: product.categoryName,
      totalStock: product.stock,
      stockByLocation: stockByLocation.map(toStockByLocationOutput),
      presentations: presentations.map(toProductPresentationOutput),
      recentMovements: recentMovements.map(toInventoryMovementOutput),
    };
  }
}

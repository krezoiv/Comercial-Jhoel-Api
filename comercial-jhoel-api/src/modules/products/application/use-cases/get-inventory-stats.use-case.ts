import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { InventoryStatsOutput } from '../dtos/inventory-stats-output';

/** Backs the "Total de productos"/"Stock total"/"Stock bajo"/valor de inventario tiles — a real SQL aggregate over the whole active catalog, independent of whatever page size the product list itself is fetching. */
@Injectable()
export class GetInventoryStatsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<InventoryStatsOutput> {
    return this.productRepository.getInventoryStats();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type {
  CatalogProductRepository,
  ReorderCatalogProductItem,
} from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';

/** Admin-only, secuencial, sin concurrencia esperada — un `UPDATE` plano por fila dentro de una transacción, sin necesidad de stored function (misma convención ya usada en Teléfonos). */
@Injectable()
export class ReorderCatalogProductsUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(items: ReorderCatalogProductItem[]): Promise<void> {
    for (const item of items) {
      const product = await this.catalogProductRepository.findById(item.id);
      if (!product) {
        throw new CatalogProductNotFoundError(item.id);
      }
    }
    await this.catalogProductRepository.reorder(items);
  }
}

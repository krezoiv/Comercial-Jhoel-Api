import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { CatalogProductSection } from '../../domain/entities/catalog-product.entity';
import { InvalidProductForCatalogError } from '../../domain/errors/invalid-product-for-catalog.error';
import { CatalogProductOutput, toCatalogProductOutput } from '../dtos/catalog-product-output';

export interface CreateCatalogProductInput {
  productId: string;
  section: CatalogProductSection;
  catalogDescription: string | null;
  userId: string;
}

/**
 * Publica un producto de Inventario en el catálogo — nunca copia sus
 * datos, solo referencia `productId`. Valida contra `PRODUCT_REPOSITORY`
 * (inyectado vía `ProductsModule`, ya exportado — no requirió ningún
 * cambio ahí) que el producto exista y esté activo antes de publicarlo.
 */
@Injectable()
export class CreateCatalogProductUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: CreateCatalogProductInput): Promise<CatalogProductOutput> {
    const product = await this.productRepository.findById(input.productId);
    if (!product || !product.isActive) {
      throw new InvalidProductForCatalogError();
    }

    const catalogProduct = await this.catalogProductRepository.create({
      productId: input.productId,
      section: input.section,
      catalogDescription: input.catalogDescription?.trim() || null,
      createdBy: input.userId,
    });

    return toCatalogProductOutput(catalogProduct);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';
import {
  PublicCatalogProductOutput,
  toPublicCatalogProductOutput,
} from '../dtos/catalog-product-output';

@Injectable()
export class GetPublishedCatalogProductByIdUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string): Promise<PublicCatalogProductOutput> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product || !product.isPubliclyVisible) {
      throw new CatalogProductNotVisibleError();
    }
    return toPublicCatalogProductOutput(product);
  }
}

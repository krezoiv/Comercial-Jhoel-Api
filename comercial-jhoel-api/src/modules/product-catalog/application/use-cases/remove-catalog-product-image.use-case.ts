import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';

@Injectable()
export class RemoveCatalogProductImageUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product) {
      throw new CatalogProductNotFoundError(id);
    }
    await this.catalogProductRepository.removeImage(id, userId);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';
import { CatalogProductOutput, toCatalogProductOutput } from '../dtos/catalog-product-output';

@Injectable()
export class GetCatalogProductByIdUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string): Promise<CatalogProductOutput> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product) {
      throw new CatalogProductNotFoundError(id);
    }
    return toCatalogProductOutput(product);
  }
}

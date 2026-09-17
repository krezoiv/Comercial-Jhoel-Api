import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductSection } from '../../domain/entities/catalog-product.entity';
import {
  PublicCatalogProductOutput,
  toPublicCatalogProductOutput,
} from '../dtos/catalog-product-output';

/** Backs Librería/Variedades en la landing — solo publicaciones activas cuyo producto en Inventario también sigue activo. */
@Injectable()
export class ListPublishedCatalogProductsUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(section: CatalogProductSection): Promise<PublicCatalogProductOutput[]> {
    const products = await this.catalogProductRepository.findPublished(section);
    return products.map(toPublicCatalogProductOutput);
  }
}

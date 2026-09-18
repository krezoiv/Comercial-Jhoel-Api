import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductSection } from '../../domain/entities/catalog-product.entity';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
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
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(
    section: CatalogProductSection,
    visitorId?: string,
  ): Promise<PublicCatalogProductOutput[]> {
    const products = await this.catalogProductRepository.findPublished(section);
    const ids = products.map((product) => product.id);
    const [counts, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCountsBatch('PRODUCT', ids),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('PRODUCT', visitorId, ids)
        : Promise.resolve(new Set<string>()),
    ]);
    return products.map((product) =>
      toPublicCatalogProductOutput(product, counts.get(product.id) ?? 0, likedIds.has(product.id)),
    );
  }
}

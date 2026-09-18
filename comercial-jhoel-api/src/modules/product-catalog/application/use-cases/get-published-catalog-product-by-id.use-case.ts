import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import {
  PublicCatalogProductOutput,
  toPublicCatalogProductOutput,
} from '../dtos/catalog-product-output';

@Injectable()
export class GetPublishedCatalogProductByIdUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(id: string, visitorId?: string): Promise<PublicCatalogProductOutput> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product || !product.isPubliclyVisible) {
      throw new CatalogProductNotVisibleError();
    }
    const [likesCount, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCount('PRODUCT', id),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('PRODUCT', visitorId, [id])
        : Promise.resolve(new Set<string>()),
    ]);
    return toPublicCatalogProductOutput(product, likesCount, likedIds.has(id));
  }
}

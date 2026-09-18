import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type {
  CatalogLikeAction,
  CatalogLikeRepository,
} from '../../../likes/domain/repositories/catalog-like.repository';

/**
 * "Me gusta" público — Librería y Variedades por igual (comparten tabla).
 * El conteo real y el anti-duplicado por visitante viven en
 * `catalog_likes` (ver `CatalogLikeRepository`), nunca en un contador
 * confiado del frontend. `LIKE` exige visibilidad pública; `UNLIKE` no —
 * un visitante siempre puede deshacer su propio like aunque el producto ya
 * no esté visible, y los likes históricos nunca se borran al desactivar.
 */
@Injectable()
export class LikeCatalogProductUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(
    id: string,
    visitorId: string,
    action: CatalogLikeAction,
  ): Promise<{ likesCount: number; liked: boolean }> {
    if (action === 'LIKE') {
      const product = await this.catalogProductRepository.findById(id);
      if (!product || !product.isPubliclyVisible) {
        throw new CatalogProductNotVisibleError();
      }
      await this.catalogLikeRepository.like('PRODUCT', id, visitorId);
    } else {
      await this.catalogLikeRepository.unlike('PRODUCT', id, visitorId);
    }
    const likesCount = await this.catalogLikeRepository.getCount('PRODUCT', id);
    return { likesCount, liked: action === 'LIKE' };
  }
}

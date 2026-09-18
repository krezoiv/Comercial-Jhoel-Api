import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';

/**
 * "Me gusta" público — Librería y Variedades por igual (comparten tabla).
 * `delta` siempre `+1`/`-1`, nunca un valor arbitrario del cliente; el
 * piso de 0 y el conteo real los garantiza siempre `adjustLikes` en el
 * repositorio, atómicamente.
 */
@Injectable()
export class LikeCatalogProductUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string, delta: 1 | -1): Promise<{ likesCount: number }> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product || !product.isPubliclyVisible) {
      throw new CatalogProductNotVisibleError();
    }
    const likesCount = await this.catalogProductRepository.adjustLikes(id, delta);
    return { likesCount };
  }
}

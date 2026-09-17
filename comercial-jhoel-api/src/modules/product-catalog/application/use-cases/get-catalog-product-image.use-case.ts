import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';

export interface CatalogProductImageBytesOutput {
  data: Buffer;
  mimeType: string;
}

/** Público, sin guard — pero valida que la publicación siga visible: desactivarla oculta también su imagen, no solo su ficha. */
@Injectable()
export class GetCatalogProductImageUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(catalogProductId: string): Promise<CatalogProductImageBytesOutput> {
    const product = await this.catalogProductRepository.findById(catalogProductId);
    if (!product || !product.isPubliclyVisible) {
      throw new CatalogProductNotVisibleError();
    }

    const image = await this.catalogProductRepository.getImage(catalogProductId);
    if (!image) {
      throw new CatalogProductNotVisibleError();
    }

    return { data: image.data, mimeType: image.mimeType };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';
import {
  assertValidCatalogProductImage,
  UploadedCatalogProductImage,
} from '../utils/assert-valid-catalog-product-image';

export interface SetCatalogProductImageInput {
  catalogProductId: string;
  image: UploadedCatalogProductImage;
  userId: string;
}

/** Subir = reemplazar — una sola imagen por publicación, sin galería. */
@Injectable()
export class SetCatalogProductImageUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(input: SetCatalogProductImageInput): Promise<void> {
    assertValidCatalogProductImage(input.image);

    const product = await this.catalogProductRepository.findById(input.catalogProductId);
    if (!product) {
      throw new CatalogProductNotFoundError(input.catalogProductId);
    }

    await this.catalogProductRepository.setImage(
      input.catalogProductId,
      {
        data: input.image.buffer,
        mimeType: input.image.mimetype,
        sizeBytes: input.image.size,
      },
      input.userId,
    );
  }
}

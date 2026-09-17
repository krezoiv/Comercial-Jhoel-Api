import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import { CatalogImageNotFoundError } from '../../domain/errors/catalog-image-not-found.error';

/**
 * The one hard-delete in this module — a product photo is editorial
 * content, not a financial/historical record (see the migration's own doc
 * comment). If the removed image was the primary one and others remain,
 * promotes the lowest-`sortOrder` remaining image to primary — a phone
 * with at least one image always has exactly one primary.
 */
@Injectable()
export class RemoveCatalogPhoneImageUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(catalogPhoneId: string, imageId: string): Promise<void> {
    const phone = await this.catalogPhoneRepository.findById(catalogPhoneId);
    if (!phone) {
      throw new CatalogPhoneNotFoundError(catalogPhoneId);
    }
    const image = phone.images.find((item) => item.id === imageId);
    if (!image) {
      throw new CatalogImageNotFoundError(imageId);
    }

    await this.catalogPhoneRepository.removeImage(catalogPhoneId, imageId);

    if (image.isPrimary) {
      const remaining =
        await this.catalogPhoneRepository.listImages(catalogPhoneId);
      if (remaining.length > 0) {
        const next = [...remaining].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        )[0];
        await this.catalogPhoneRepository.setPrimaryImage(
          catalogPhoneId,
          next.id,
        );
      }
    }
  }
}

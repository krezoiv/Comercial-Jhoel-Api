import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import {
  assertValidCatalogImage,
  UploadedCatalogImage,
} from '../utils/assert-valid-catalog-image';

export interface AddCatalogPhoneImageInput {
  catalogPhoneId: string;
  image: UploadedCatalogImage;
  userId: string;
}

export interface AddCatalogPhoneImageOutput {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** The first image ever added to a phone is automatically marked primary — every phone that has at least one image always has exactly one primary, never zero (enforced by this plus `RemoveCatalogPhoneImageUseCase`'s own promotion logic). */
@Injectable()
export class AddCatalogPhoneImageUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(
    input: AddCatalogPhoneImageInput,
  ): Promise<AddCatalogPhoneImageOutput> {
    assertValidCatalogImage(input.image);

    const phone = await this.catalogPhoneRepository.findById(
      input.catalogPhoneId,
    );
    if (!phone) {
      throw new CatalogPhoneNotFoundError(input.catalogPhoneId);
    }

    const isFirstImage = phone.images.length === 0;
    const nextSortOrder =
      phone.images.length === 0
        ? 0
        : Math.max(...phone.images.map((image) => image.sortOrder)) + 1;

    const image = await this.catalogPhoneRepository.addImage({
      catalogPhoneId: input.catalogPhoneId,
      imageData: input.image.buffer,
      mimeType: input.image.mimetype,
      sizeBytes: input.image.size,
      isPrimary: isFirstImage,
      sortOrder: nextSortOrder,
      createdBy: input.userId,
    });

    return {
      id: image.id,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
    };
  }
}

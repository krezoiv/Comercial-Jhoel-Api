import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import { CatalogImageNotFoundError } from '../../domain/errors/catalog-image-not-found.error';

@Injectable()
export class SetPrimaryCatalogPhoneImageUseCase {
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
    await this.catalogPhoneRepository.setPrimaryImage(catalogPhoneId, imageId);
  }
}

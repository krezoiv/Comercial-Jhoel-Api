import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotPublishedError } from '../../domain/errors/catalog-phone-not-published.error';

export interface CatalogPhoneImageBytesOutput {
  data: Buffer;
  mimeType: string;
}

/**
 * The one public place a catalog photo's bytes are served
 * (`GET /catalog/phones/images/:imageId`, no guard, long
 * `Cache-Control` — see the controller). Also validates the parent phone
 * is still published: despublicar a phone hides its photos too, not just
 * its listing entry, even though the raw image row itself still exists.
 */
@Injectable()
export class GetCatalogPhoneImageUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(imageId: string): Promise<CatalogPhoneImageBytesOutput> {
    const image = await this.catalogPhoneRepository.getImage(imageId);
    if (!image) {
      throw new CatalogPhoneNotPublishedError();
    }
    const phone = await this.catalogPhoneRepository.findById(
      image.catalogPhoneId,
    );
    if (!phone || !phone.isPublished || !phone.isActive) {
      throw new CatalogPhoneNotPublishedError();
    }
    return { data: image.data, mimeType: image.mimeType };
  }
}

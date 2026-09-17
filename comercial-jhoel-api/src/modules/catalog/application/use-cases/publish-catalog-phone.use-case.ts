import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import { CatalogPhoneInactiveError } from '../../domain/errors/catalog-phone-inactive.error';
import { CatalogPhoneNoImagesError } from '../../domain/errors/catalog-phone-no-images.error';

/**
 * A phone can only go live on the public landing once it's active and has
 * at least one photo — "no se publica una vitrina sin foto" is enforced
 * here, not just as a frontend nicety (see the plan's own decision).
 */
@Injectable()
export class PublishCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const phone = await this.catalogPhoneRepository.findById(id);
    if (!phone) {
      throw new CatalogPhoneNotFoundError(id);
    }
    if (!phone.isActive) {
      throw new CatalogPhoneInactiveError();
    }
    if (phone.images.length === 0) {
      throw new CatalogPhoneNoImagesError();
    }
    await this.catalogPhoneRepository.setPublished(id, true, userId);
  }
}

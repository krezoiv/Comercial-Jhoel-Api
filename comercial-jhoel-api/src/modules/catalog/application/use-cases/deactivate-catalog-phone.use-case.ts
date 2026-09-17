import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';

/**
 * Soft delete only, same convention as every reference table in this
 * codebase. Force-unpublishes as part of the same action — a deactivated
 * phone must never remain visible on the public landing just because
 * nobody remembered to unpublish it first.
 */
@Injectable()
export class DeactivateCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const phone = await this.catalogPhoneRepository.findById(id);
    if (!phone) {
      throw new CatalogPhoneNotFoundError(id);
    }
    if (phone.isPublished) {
      await this.catalogPhoneRepository.setPublished(id, false, userId);
    }
    await this.catalogPhoneRepository.setActive(id, false, userId);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import {
  PublicCatalogPhoneOutput,
  toPublicCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

/** Backs the landing page's "Teléfonos" carousel — only `isPublished && isActive`, ordered by `sortOrder`, never exposes cost/inventory/admin fields. */
@Injectable()
export class ListPublishedCatalogPhonesUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(visitorId?: string): Promise<PublicCatalogPhoneOutput[]> {
    const [phones, settings] = await Promise.all([
      this.catalogPhoneRepository.findPublished(),
      this.companySettingsRepository.get(),
    ]);
    const ids = phones.map((phone) => phone.id);
    const [counts, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCountsBatch('PHONE', ids),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('PHONE', visitorId, ids)
        : Promise.resolve(new Set<string>()),
    ]);
    return phones.map((phone) =>
      toPublicCatalogPhoneOutput(
        phone,
        settings.krediyaMinAmount,
        counts.get(phone.id) ?? 0,
        likedIds.has(phone.id),
      ),
    );
  }
}

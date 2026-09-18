import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import { CatalogPhoneNotPublishedError } from '../../domain/errors/catalog-phone-not-published.error';
import {
  PublicCatalogPhoneOutput,
  toPublicCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

/** 404 both when the id doesn't exist and when it exists but isn't published/active — never reveals which, same "don't leak existence" reasoning as the rest of this module's public surface. */
@Injectable()
export class GetPublishedCatalogPhoneByIdUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(id: string, visitorId?: string): Promise<PublicCatalogPhoneOutput> {
    const [phone, settings] = await Promise.all([
      this.catalogPhoneRepository.findById(id),
      this.companySettingsRepository.get(),
    ]);
    if (!phone || !phone.isPublished || !phone.isActive) {
      throw new CatalogPhoneNotPublishedError();
    }
    const [likesCount, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCount('PHONE', id),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('PHONE', visitorId, [id])
        : Promise.resolve(new Set<string>()),
    ]);
    return toPublicCatalogPhoneOutput(phone, settings.krediyaMinAmount, likesCount, likedIds.has(id));
  }
}

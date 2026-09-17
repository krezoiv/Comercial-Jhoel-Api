import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import {
  CatalogPhoneOutput,
  toCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

@Injectable()
export class GetCatalogPhoneByIdUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(id: string): Promise<CatalogPhoneOutput> {
    const [phone, settings] = await Promise.all([
      this.catalogPhoneRepository.findById(id),
      this.companySettingsRepository.get(),
    ]);
    if (!phone) {
      throw new CatalogPhoneNotFoundError(id);
    }
    return toCatalogPhoneOutput(phone, settings.krediyaMinAmount);
  }
}

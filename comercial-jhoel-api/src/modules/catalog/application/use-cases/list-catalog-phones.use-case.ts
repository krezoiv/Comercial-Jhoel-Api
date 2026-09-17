import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type {
  CatalogPhoneRepository,
  ListCatalogPhonesOptions,
} from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import {
  CatalogPhoneOutput,
  toCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

/** Admin listing — includes unpublished/inactive phones (this is the management screen, not the public catalog). */
@Injectable()
export class ListCatalogPhonesUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(
    options?: ListCatalogPhonesOptions,
  ): Promise<CatalogPhoneOutput[]> {
    const [phones, settings] = await Promise.all([
      this.catalogPhoneRepository.findAll(options),
      this.companySettingsRepository.get(),
    ]);
    return phones.map((phone) =>
      toCatalogPhoneOutput(phone, settings.krediyaMinAmount),
    );
  }
}

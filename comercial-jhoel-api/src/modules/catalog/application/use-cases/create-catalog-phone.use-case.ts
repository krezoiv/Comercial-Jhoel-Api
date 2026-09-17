import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CatalogPhoneExtraSpec } from '../../domain/entities/catalog-phone.entity';
import {
  CatalogPhoneOutput,
  toCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

export interface CreateCatalogPhoneInput {
  brand: string;
  model: string;
  description: string | null;
  price: number;
  screen: string | null;
  ram: string | null;
  storage: string | null;
  camera: string | null;
  battery: string | null;
  processor: string | null;
  operatingSystem: string | null;
  extraSpecs: CatalogPhoneExtraSpec[];
  userId: string;
}

/**
 * Creates a new catalog listing, always `isPublished: false` — publishing
 * is a separate, explicit admin action (`PublishCatalogPhoneUseCase`) that
 * requires at least one photo first, so a phone is never accidentally
 * created already visible on the public landing.
 */
@Injectable()
export class CreateCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(input: CreateCatalogPhoneInput): Promise<CatalogPhoneOutput> {
    const settings = await this.companySettingsRepository.get();
    const phone = await this.catalogPhoneRepository.create({
      brand: input.brand.trim(),
      model: input.model.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      screen: input.screen?.trim() || null,
      ram: input.ram?.trim() || null,
      storage: input.storage?.trim() || null,
      camera: input.camera?.trim() || null,
      battery: input.battery?.trim() || null,
      processor: input.processor?.trim() || null,
      operatingSystem: input.operatingSystem?.trim() || null,
      extraSpecs: input.extraSpecs,
      createdBy: input.userId,
    });
    return toCatalogPhoneOutput(phone, settings.krediyaMinAmount);
  }
}

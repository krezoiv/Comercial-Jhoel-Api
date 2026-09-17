import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';
import { CatalogPhoneExtraSpec } from '../../domain/entities/catalog-phone.entity';
import {
  CatalogPhoneOutput,
  toCatalogPhoneOutput,
} from '../dtos/catalog-phone-output';

export interface UpdateCatalogPhoneInput {
  brand?: string;
  model?: string;
  description?: string | null;
  price?: number;
  screen?: string | null;
  ram?: string | null;
  storage?: string | null;
  camera?: string | null;
  battery?: string | null;
  processor?: string | null;
  operatingSystem?: string | null;
  extraSpecs?: CatalogPhoneExtraSpec[];
  userId: string;
}

/**
 * Edits any subset of specs/price/description — never touches
 * `isActive`/`isPublished`/`sortOrder` (those have their own dedicated use
 * cases so each has a single, clear entry point). A published phone stays
 * published through an edit — a price/spec change reflects live on the
 * public catalog the next time it's fetched, no re-publish step needed
 * (see the plan's own "sin denormalización de vitrina" decision).
 */
@Injectable()
export class UpdateCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCatalogPhoneInput,
  ): Promise<CatalogPhoneOutput> {
    const existing = await this.catalogPhoneRepository.findById(id);
    if (!existing) {
      throw new CatalogPhoneNotFoundError(id);
    }

    const settings = await this.companySettingsRepository.get();
    const updated = await this.catalogPhoneRepository.update(id, {
      brand: input.brand?.trim(),
      model: input.model?.trim(),
      description:
        input.description === undefined
          ? undefined
          : input.description?.trim() || null,
      price: input.price,
      screen:
        input.screen === undefined ? undefined : input.screen?.trim() || null,
      ram: input.ram === undefined ? undefined : input.ram?.trim() || null,
      storage:
        input.storage === undefined ? undefined : input.storage?.trim() || null,
      camera:
        input.camera === undefined ? undefined : input.camera?.trim() || null,
      battery:
        input.battery === undefined ? undefined : input.battery?.trim() || null,
      processor:
        input.processor === undefined
          ? undefined
          : input.processor?.trim() || null,
      operatingSystem:
        input.operatingSystem === undefined
          ? undefined
          : input.operatingSystem?.trim() || null,
      extraSpecs: input.extraSpecs,
      updatedBy: input.userId,
    });
    return toCatalogPhoneOutput(updated, settings.krediyaMinAmount);
  }
}

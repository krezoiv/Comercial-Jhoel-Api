import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_SETTINGS_REPOSITORY } from '../../domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import {
  PublicCompanyInfoOutput,
  toPublicCompanyInfoOutput,
} from '../dtos/public-company-info-output';

/** Backs the public landing page's "Contacto" section — reuses the same `CompanySettingsRepository.get()` every PDF letterhead already reads, never a second source of truth for company data. */
@Injectable()
export class GetPublicCompanyInfoUseCase {
  constructor(
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(): Promise<PublicCompanyInfoOutput> {
    const settings = await this.companySettingsRepository.get();
    return toPublicCompanyInfoOutput(settings);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_SETTINGS_REPOSITORY } from '../../domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import {
  CompanySettingsOutput,
  toCompanySettingsOutput,
} from '../dtos/company-settings-output';

export interface UpdateCompanySettingsInput {
  businessName?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  taxId?: string | null;
  logoBase64?: string | null;
  socialMedia?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  businessHours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  updatedBy: string;
}

@Injectable()
export class UpdateCompanySettingsUseCase {
  constructor(
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(
    input: UpdateCompanySettingsInput,
  ): Promise<CompanySettingsOutput> {
    const updated = await this.companySettingsRepository.update(input);
    return toCompanySettingsOutput(updated);
  }
}

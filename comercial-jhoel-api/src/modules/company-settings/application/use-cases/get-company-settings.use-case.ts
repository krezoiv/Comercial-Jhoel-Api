import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_SETTINGS_REPOSITORY } from '../../domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import {
  CompanySettingsOutput,
  toCompanySettingsOutput,
} from '../dtos/company-settings-output';

@Injectable()
export class GetCompanySettingsUseCase {
  constructor(
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(): Promise<CompanySettingsOutput> {
    const settings = await this.companySettingsRepository.get();
    return toCompanySettingsOutput(settings);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySettingsOrmEntity } from './infrastructure/persistence/company-settings.orm-entity';
import { TypeOrmCompanySettingsRepository } from './infrastructure/persistence/typeorm-company-settings.repository';
import { COMPANY_SETTINGS_REPOSITORY } from './domain/repositories/company-settings.repository';
import { GetCompanySettingsUseCase } from './application/use-cases/get-company-settings.use-case';
import { UpdateCompanySettingsUseCase } from './application/use-cases/update-company-settings.use-case';
import { GetPublicCompanyInfoUseCase } from './application/use-cases/get-public-company-info.use-case';
import { CompanySettingsController } from './presentation/controllers/company-settings.controller';
import { PublicCompanyController } from './presentation/controllers/public-company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySettingsOrmEntity])],
  controllers: [CompanySettingsController, PublicCompanyController],
  providers: [
    {
      provide: COMPANY_SETTINGS_REPOSITORY,
      useClass: TypeOrmCompanySettingsRepository,
    },
    GetCompanySettingsUseCase,
    UpdateCompanySettingsUseCase,
    GetPublicCompanyInfoUseCase,
  ],
  // Exported so the Sales/Purchases/Tickets/Cotizaciones PDF builders can read the letterhead data without duplicating this repository.
  exports: [COMPANY_SETTINGS_REPOSITORY],
})
export class CompanySettingsModule {}

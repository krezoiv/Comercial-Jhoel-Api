import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySettingsOrmEntity } from './infrastructure/persistence/company-settings.orm-entity';
import { TypeOrmCompanySettingsRepository } from './infrastructure/persistence/typeorm-company-settings.repository';
import { COMPANY_SETTINGS_REPOSITORY } from './domain/repositories/company-settings.repository';
import { GetCompanySettingsUseCase } from './application/use-cases/get-company-settings.use-case';
import { UpdateCompanySettingsUseCase } from './application/use-cases/update-company-settings.use-case';
import { CompanySettingsController } from './presentation/controllers/company-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySettingsOrmEntity])],
  controllers: [CompanySettingsController],
  providers: [
    {
      provide: COMPANY_SETTINGS_REPOSITORY,
      useClass: TypeOrmCompanySettingsRepository,
    },
    GetCompanySettingsUseCase,
    UpdateCompanySettingsUseCase,
  ],
  // Exported so the Sales/Purchases/Tickets/Cotizaciones PDF builders can read the letterhead data without duplicating this repository.
  exports: [COMPANY_SETTINGS_REPOSITORY],
})
export class CompanySettingsModule {}

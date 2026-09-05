import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertSettingsOrmEntity } from './infrastructure/persistence/alert-settings.orm-entity';
import { TypeOrmAlertSettingsRepository } from './infrastructure/persistence/typeorm-alert-settings.repository';
import { ALERT_SETTINGS_REPOSITORY } from './domain/repositories/alert-settings.repository';
import { GetAlertSettingsUseCase } from './application/use-cases/get-alert-settings.use-case';
import { UpdateAlertSettingsUseCase } from './application/use-cases/update-alert-settings.use-case';
import { AlertSettingsController } from './presentation/controllers/alert-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertSettingsOrmEntity])],
  controllers: [AlertSettingsController],
  providers: [
    {
      provide: ALERT_SETTINGS_REPOSITORY,
      useClass: TypeOrmAlertSettingsRepository,
    },
    GetAlertSettingsUseCase,
    UpdateAlertSettingsUseCase,
  ],
  // Exported so `AlertsModule` can read `purchasePaymentAlertDays` without duplicating this repository.
  exports: [ALERT_SETTINGS_REPOSITORY],
})
export class AlertSettingsModule {}

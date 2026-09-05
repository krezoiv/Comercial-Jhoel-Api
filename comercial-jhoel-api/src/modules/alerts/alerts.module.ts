import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertReadMarkOrmEntity } from './infrastructure/persistence/alert-read-mark.orm-entity';
import { TypeOrmAlertReadMarkRepository } from './infrastructure/persistence/typeorm-alert-read-mark.repository';
import { ALERT_READ_MARK_REPOSITORY } from './domain/repositories/alert-read-mark.repository';
import { GetAlertsUseCase } from './application/use-cases/get-alerts.use-case';
import { MarkAlertReadUseCase } from './application/use-cases/mark-alert-read.use-case';
import { MarkAllAlertsReadUseCase } from './application/use-cases/mark-all-alerts-read.use-case';
import { AlertsController } from './presentation/controllers/alerts.controller';
import { PurchasesModule } from '../purchases/purchases.module';
import { InventoryModule } from '../inventory/inventory.module';
import { RechargesModule } from '../recharges/recharges.module';
import { AlertSettingsModule } from '../alert-settings/alert-settings.module';

/**
 * Reads across four unrelated modules' own domain tokens (purchases,
 * inventory, recharges, alert-settings) — imports each module for its
 * exported repository token rather than duplicating a `TypeOrmModule
 * .forFeature` the way `ReportsModule`/`DashboardModule` do, since every
 * value this module needs is already exposed through a clean, existing
 * repository interface (a single-repository reuse case, not the
 * "read spans many unrelated tables with no existing interface" case those
 * two modules are actually in).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AlertReadMarkOrmEntity]),
    PurchasesModule,
    InventoryModule,
    RechargesModule,
    AlertSettingsModule,
  ],
  controllers: [AlertsController],
  providers: [
    {
      provide: ALERT_READ_MARK_REPOSITORY,
      useClass: TypeOrmAlertReadMarkRepository,
    },
    GetAlertsUseCase,
    MarkAlertReadUseCase,
    MarkAllAlertsReadUseCase,
  ],
})
export class AlertsModule {}

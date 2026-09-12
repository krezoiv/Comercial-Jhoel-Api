import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/shared.module';
import { RechargeTypeOrmEntity } from './infrastructure/persistence/recharge-type.orm-entity';
import { RechargeDailyBalanceOrmEntity } from './infrastructure/persistence/recharge-daily-balance.orm-entity';
import { RechargeSalesClosureOrmEntity } from './infrastructure/persistence/recharge-sales-closure.orm-entity';
import { RechargeSaleOrmEntity } from './infrastructure/persistence/recharge-sale.orm-entity';
import { RechargeDayOpeningOrmEntity } from './infrastructure/persistence/recharge-day-opening.orm-entity';
import { RechargeDayAuditLogOrmEntity } from './infrastructure/persistence/recharge-day-audit-log.orm-entity';
import { RechargeSimTypeOrmEntity } from './infrastructure/persistence/recharge-sim-type.orm-entity';
import { RechargeSimDailyStockOrmEntity } from './infrastructure/persistence/recharge-sim-daily-stock.orm-entity';
import { RechargePurchaseFullOrmEntity } from './infrastructure/persistence/recharge-purchase-full.orm-entity';
import { TypeOrmRechargeTypeRepository } from './infrastructure/persistence/typeorm-recharge-type.repository';
import { TypeOrmRechargeDailyBalanceRepository } from './infrastructure/persistence/typeorm-recharge-daily-balance.repository';
import { TypeOrmRechargeSalesClosureRepository } from './infrastructure/persistence/typeorm-recharge-sales-closure.repository';
import { TypeOrmRechargeSaleRepository } from './infrastructure/persistence/typeorm-recharge-sale.repository';
import { TypeOrmRechargeDayOpeningRepository } from './infrastructure/persistence/typeorm-recharge-day-opening.repository';
import { TypeOrmRechargeDayAuditLogRepository } from './infrastructure/persistence/typeorm-recharge-day-audit-log.repository';
import { TypeOrmRechargeSimTypeRepository } from './infrastructure/persistence/typeorm-recharge-sim-type.repository';
import { TypeOrmRechargeSimDailyStockRepository } from './infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository';
import { TypeOrmRechargeSimSaleRegistrationRepository } from './infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository';
import { TypeOrmRechargePurchaseRepository } from './infrastructure/persistence/typeorm-recharge-purchase.repository';
import { RECHARGE_TYPE_REPOSITORY } from './domain/repositories/recharge-type.repository';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from './domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from './domain/repositories/recharge-sales-closure.repository';
import { RECHARGE_SALE_REPOSITORY } from './domain/repositories/recharge-sale.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from './domain/repositories/recharge-day-opening.repository';
import { RECHARGE_DAY_AUDIT_LOG_REPOSITORY } from './domain/repositories/recharge-day-audit-log.repository';
import { RECHARGE_SIM_TYPE_REPOSITORY } from './domain/repositories/recharge-sim-type.repository';
import { RECHARGE_SIM_DAILY_STOCK_REPOSITORY } from './domain/repositories/recharge-sim-daily-stock.repository';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from './domain/repositories/recharge-sim-sale-registration.repository';
import { RECHARGE_PURCHASE_REPOSITORY } from './domain/repositories/recharge-purchase.repository';
import { ListRechargeTypesUseCase } from './application/use-cases/list-recharge-types.use-case';
import { GetRechargeDailySummaryUseCase } from './application/use-cases/get-recharge-daily-summary.use-case';
import { RegisterRechargePurchaseUseCase } from './application/use-cases/register-recharge-purchase.use-case';
import { RegisterRechargeFinalBalanceUseCase } from './application/use-cases/register-recharge-final-balance.use-case';
import { GetRechargeHistoryUseCase } from './application/use-cases/get-recharge-history.use-case';
import { GetRechargeSalesSummaryUseCase } from './application/use-cases/get-recharge-sales-summary.use-case';
import { RegisterRechargeSalesClosureUseCase } from './application/use-cases/register-recharge-sales-closure.use-case';
import { GetRechargeSalesUseCase } from './application/use-cases/get-recharge-sales.use-case';
import { CreateRechargeSaleUseCase } from './application/use-cases/create-recharge-sale.use-case';
import { UpdateRechargeSaleUseCase } from './application/use-cases/update-recharge-sale.use-case';
import { DeleteRechargeSaleUseCase } from './application/use-cases/delete-recharge-sale.use-case';
import { GetRechargeDayStatusUseCase } from './application/use-cases/get-recharge-day-status.use-case';
import { OpenRechargeDayUseCase } from './application/use-cases/open-recharge-day.use-case';
import { CloseRechargeDayUseCase } from './application/use-cases/close-recharge-day.use-case';
import { UpdateRechargeTypeMinBalanceUseCase } from './application/use-cases/update-recharge-type-min-balance.use-case';
import { ListClosedRechargeDaysUseCase } from './application/use-cases/list-closed-recharge-days.use-case';
import { GetRechargeDayDetailUseCase } from './application/use-cases/get-recharge-day-detail.use-case';
import { ReopenRechargeDayUseCase } from './application/use-cases/reopen-recharge-day.use-case';
import { CancelRechargeDayUseCase } from './application/use-cases/cancel-recharge-day.use-case';
import { ListRechargeSimTypesUseCase } from './application/use-cases/list-recharge-sim-types.use-case';
import { GetRechargeSimDailySummaryUseCase } from './application/use-cases/get-recharge-sim-daily-summary.use-case';
import { RegisterRechargeSimPurchaseUseCase } from './application/use-cases/register-recharge-sim-purchase.use-case';
import { RegisterRechargeSimSaleUseCase } from './application/use-cases/register-recharge-sim-sale.use-case';
import { RegisterRechargeSimSaleWithRegistrationUseCase } from './application/use-cases/register-recharge-sim-sale-with-registration.use-case';
import { VoidRechargeSimSaleRegistrationUseCase } from './application/use-cases/void-recharge-sim-sale-registration.use-case';
import { GetRechargeSimSaleRegistrationByIdUseCase } from './application/use-cases/get-recharge-sim-sale-registration-by-id.use-case';
import { ListRechargeSimSaleRegistrationsUseCase } from './application/use-cases/list-recharge-sim-sale-registrations.use-case';
import { GetRechargeSimSaleRegistrationDpiImageUseCase } from './application/use-cases/get-recharge-sim-sale-registration-dpi-image.use-case';
import { GetRechargePurchasesUseCase } from './application/use-cases/get-recharge-purchases.use-case';
import { VoidRechargePurchaseUseCase } from './application/use-cases/void-recharge-purchase.use-case';
import { RechargesController } from './presentation/controllers/recharges.controller';
import { RechargeDaysController } from './presentation/controllers/recharge-days.controller';
import { RechargeSimsController } from './presentation/controllers/recharge-sims.controller';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      RechargeTypeOrmEntity,
      RechargeDailyBalanceOrmEntity,
      RechargeSalesClosureOrmEntity,
      RechargeSaleOrmEntity,
      RechargeDayOpeningOrmEntity,
      RechargeDayAuditLogOrmEntity,
      RechargeSimTypeOrmEntity,
      RechargeSimDailyStockOrmEntity,
      RechargePurchaseFullOrmEntity,
    ]),
  ],
  controllers: [
    RechargesController,
    RechargeDaysController,
    RechargeSimsController,
  ],
  providers: [
    {
      provide: RECHARGE_TYPE_REPOSITORY,
      useClass: TypeOrmRechargeTypeRepository,
    },
    {
      provide: RECHARGE_DAILY_BALANCE_REPOSITORY,
      useClass: TypeOrmRechargeDailyBalanceRepository,
    },
    {
      provide: RECHARGE_SALES_CLOSURE_REPOSITORY,
      useClass: TypeOrmRechargeSalesClosureRepository,
    },
    {
      provide: RECHARGE_SALE_REPOSITORY,
      useClass: TypeOrmRechargeSaleRepository,
    },
    {
      provide: RECHARGE_DAY_OPENING_REPOSITORY,
      useClass: TypeOrmRechargeDayOpeningRepository,
    },
    {
      provide: RECHARGE_DAY_AUDIT_LOG_REPOSITORY,
      useClass: TypeOrmRechargeDayAuditLogRepository,
    },
    {
      provide: RECHARGE_SIM_TYPE_REPOSITORY,
      useClass: TypeOrmRechargeSimTypeRepository,
    },
    {
      provide: RECHARGE_SIM_DAILY_STOCK_REPOSITORY,
      useClass: TypeOrmRechargeSimDailyStockRepository,
    },
    {
      provide: RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY,
      useClass: TypeOrmRechargeSimSaleRegistrationRepository,
    },
    {
      provide: RECHARGE_PURCHASE_REPOSITORY,
      useClass: TypeOrmRechargePurchaseRepository,
    },
    ListRechargeTypesUseCase,
    GetRechargeDailySummaryUseCase,
    RegisterRechargePurchaseUseCase,
    RegisterRechargeFinalBalanceUseCase,
    GetRechargeHistoryUseCase,
    GetRechargeSalesSummaryUseCase,
    RegisterRechargeSalesClosureUseCase,
    GetRechargeSalesUseCase,
    CreateRechargeSaleUseCase,
    UpdateRechargeSaleUseCase,
    DeleteRechargeSaleUseCase,
    GetRechargeDayStatusUseCase,
    OpenRechargeDayUseCase,
    CloseRechargeDayUseCase,
    UpdateRechargeTypeMinBalanceUseCase,
    ListClosedRechargeDaysUseCase,
    GetRechargeDayDetailUseCase,
    ReopenRechargeDayUseCase,
    CancelRechargeDayUseCase,
    ListRechargeSimTypesUseCase,
    GetRechargeSimDailySummaryUseCase,
    RegisterRechargeSimPurchaseUseCase,
    RegisterRechargeSimSaleUseCase,
    RegisterRechargeSimSaleWithRegistrationUseCase,
    VoidRechargeSimSaleRegistrationUseCase,
    GetRechargeSimSaleRegistrationByIdUseCase,
    ListRechargeSimSaleRegistrationsUseCase,
    GetRechargeSimSaleRegistrationDpiImageUseCase,
    GetRechargePurchasesUseCase,
    VoidRechargePurchaseUseCase,
  ],
  // Exported for `ReportsModule`'s new Recargas report: `RECHARGE_TYPE_REPOSITORY`
  // resolves the `rechargeTypeId` filter into a display name for the PDF,
  // `RECHARGE_DAILY_BALANCE_REPOSITORY` backs its own summary use case, and
  // `GetRechargeHistoryUseCase` is reused directly for the report's list
  // endpoint — identical date-range validation and pagination, no reason to
  // duplicate it. Same reuse-over-duplicate reasoning as `SalesModule`'s/
  // `PurchasesModule`'s own exports for the same purpose.
  exports: [
    RECHARGE_TYPE_REPOSITORY,
    RECHARGE_DAILY_BALANCE_REPOSITORY,
    GetRechargeHistoryUseCase,
  ],
})
export class RechargesModule {}

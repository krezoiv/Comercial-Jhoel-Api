import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeTypeOrmEntity } from './infrastructure/persistence/recharge-type.orm-entity';
import { RechargeDailyBalanceOrmEntity } from './infrastructure/persistence/recharge-daily-balance.orm-entity';
import { RechargeSalesClosureOrmEntity } from './infrastructure/persistence/recharge-sales-closure.orm-entity';
import { RechargeSaleOrmEntity } from './infrastructure/persistence/recharge-sale.orm-entity';
import { TypeOrmRechargeTypeRepository } from './infrastructure/persistence/typeorm-recharge-type.repository';
import { TypeOrmRechargeDailyBalanceRepository } from './infrastructure/persistence/typeorm-recharge-daily-balance.repository';
import { TypeOrmRechargeSalesClosureRepository } from './infrastructure/persistence/typeorm-recharge-sales-closure.repository';
import { TypeOrmRechargeSaleRepository } from './infrastructure/persistence/typeorm-recharge-sale.repository';
import { RECHARGE_TYPE_REPOSITORY } from './domain/repositories/recharge-type.repository';
import { RECHARGE_DAILY_BALANCE_REPOSITORY } from './domain/repositories/recharge-daily-balance.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from './domain/repositories/recharge-sales-closure.repository';
import { RECHARGE_SALE_REPOSITORY } from './domain/repositories/recharge-sale.repository';
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
import { RechargesController } from './presentation/controllers/recharges.controller';

// `RechargePurchaseOrmEntity` is deliberately not registered here — nothing
// in TypeScript reads `recharge_purchases` directly today (only the
// `register_recharge_purchase` stored function writes to it); it exists in
// the schema purely as the individual-movement audit trail the ticket
// required. Add the ORM entity + a listing method when a dedicated
// per-movement history view is actually needed. `RechargeSaleOrmEntity` is
// the one exception to this "write-only" pattern — the "Recargas Vendidas"
// table/cards read it back directly, so it's registered and mapped like any
// other module.
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RechargeTypeOrmEntity,
      RechargeDailyBalanceOrmEntity,
      RechargeSalesClosureOrmEntity,
      RechargeSaleOrmEntity,
    ]),
  ],
  controllers: [RechargesController],
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

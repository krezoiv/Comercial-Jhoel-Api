import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeCashBoxMovementOrmEntity } from './infrastructure/persistence/recharge-cash-box-movement.orm-entity';
import { RechargePurchaseOrmEntity } from './infrastructure/persistence/recharge-purchase.orm-entity';
import { RechargeSimSaleOrmEntity } from './infrastructure/persistence/recharge-sim-sale.orm-entity';
import { RechargeSimPurchaseOrmEntity } from './infrastructure/persistence/recharge-sim-purchase.orm-entity';
import { RechargeSaleOrmEntity } from '../recharges/infrastructure/persistence/recharge-sale.orm-entity';
import { TypeOrmRechargeCashBoxRepository } from './infrastructure/persistence/typeorm-recharge-cash-box.repository';
import { RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY } from './domain/repositories/recharge-cash-box-movement.repository';
import { GetCashBoxBalanceUseCase } from './application/use-cases/get-cash-box-balance.use-case';
import { GetCashBoxMovementsUseCase } from './application/use-cases/get-cash-box-movements.use-case';
import { RegisterCashBoxWithdrawalUseCase } from './application/use-cases/register-cash-box-withdrawal.use-case';
import { RegisterCashBoxContributionUseCase } from './application/use-cases/register-cash-box-contribution.use-case';
import { VoidCashBoxMovementUseCase } from './application/use-cases/void-cash-box-movement.use-case';
import { RechargeCashBoxController } from './presentation/controllers/recharge-cash-box.controller';

/**
 * "Gestión Caja Recargas" — fully independent from `RechargesModule`
 * (moved out of it per an explicit follow-up request: this used to be a
 * section embedded inside the Recargas Electrónicas page/module; it's now
 * its own Sistema-level module, with its own sidebar entry, route, and
 * backend module boundary). `RechargeSaleOrmEntity` is registered a SECOND
 * time here, read-only — the exact same pattern `DashboardModule`/
 * `ReportsModule` already use to read another module's tables without
 * importing that module wholesale (see `TypeOrmRechargeCashBoxRepository`'s
 * own doc comment). No other cross-module import exists in this module.
 *
 * "Aporte a Caja" (income) and "Salida de Ganancia" (expense) — the two
 * manual movement types — share one table (`recharge_cash_box_movements`),
 * one repository, one stored function, and one void use case; only their
 * registration use cases differ, mirroring Kardex financiero's own
 * Charge/Payment split over a single `movement_type`-discriminated table.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RechargeCashBoxMovementOrmEntity,
      RechargePurchaseOrmEntity,
      RechargeSimSaleOrmEntity,
      RechargeSimPurchaseOrmEntity,
      RechargeSaleOrmEntity,
    ]),
  ],
  controllers: [RechargeCashBoxController],
  providers: [
    {
      provide: RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY,
      useClass: TypeOrmRechargeCashBoxRepository,
    },
    GetCashBoxBalanceUseCase,
    GetCashBoxMovementsUseCase,
    RegisterCashBoxWithdrawalUseCase,
    RegisterCashBoxContributionUseCase,
    VoidCashBoxMovementUseCase,
  ],
  // Exported for `AlertsModule`'s "Saldo negativo en Caja Recargas" alert —
  // `GetCashBoxBalanceUseCase` is reused directly (same
  // reuse-over-duplicate reasoning as `RechargesModule` exporting
  // `GetRechargeHistoryUseCase` for Reportería) rather than re-deriving the
  // balance formula a second time.
  exports: [GetCashBoxBalanceUseCase],
})
export class RechargeCashBoxModule {}

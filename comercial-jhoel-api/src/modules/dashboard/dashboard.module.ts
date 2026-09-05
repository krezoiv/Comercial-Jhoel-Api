import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleOrmEntity } from '../sales/infrastructure/persistence/sale.orm-entity';
import { PurchaseOrmEntity } from '../purchases/infrastructure/persistence/purchase.orm-entity';
import { RechargeDailyBalanceOrmEntity } from '../recharges/infrastructure/persistence/recharge-daily-balance.orm-entity';
import { BankDepositOperationOrmEntity } from '../bank-deposits/infrastructure/persistence/bank-deposit-operation.orm-entity';
import { DASHBOARD_REPOSITORY } from './domain/repositories/dashboard.repository';
import { TypeOrmDashboardRepository } from './infrastructure/persistence/typeorm-dashboard.repository';
import { GetDashboardSummaryUseCase } from './application/use-cases/get-dashboard-summary.use-case';
import { DashboardController } from './presentation/controllers/dashboard.controller';

/**
 * Pure read-side, cross-cutting module — mirrors `ReportsModule`'s own
 * "register the existing ORM entities a second time via `forFeature`,
 * import nothing else" shape (see that module's doc comment). No new
 * tables, no new migration, no changes to `sales`/`purchases`/
 * `recharges`/`bank-deposits`' own write paths — this module only ever
 * runs `SELECT`/`SUM`/`GROUP BY` against tables those modules already own.
 * Deliberately does NOT import `BanksModule` — Transaccionar's own
 * `bank_deposit_operations` table is independent of Cuadre de Agentes'
 * `bank_balances`/`agent_reconciliations`, and this dashboard's
 * "Transacciones Bancarias" section is explicitly about the former only.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleOrmEntity,
      PurchaseOrmEntity,
      RechargeDailyBalanceOrmEntity,
      BankDepositOperationOrmEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    { provide: DASHBOARD_REPOSITORY, useClass: TypeOrmDashboardRepository },
    GetDashboardSummaryUseCase,
  ],
})
export class DashboardModule {}

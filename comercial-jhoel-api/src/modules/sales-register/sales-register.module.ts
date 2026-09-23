import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleOrmEntity } from '../sales/infrastructure/persistence/sale.orm-entity';
import { SaleDetailOrmEntity } from '../sales/infrastructure/persistence/sale-detail.orm-entity';
import { SALES_REGISTER_REPOSITORY } from './domain/repositories/sales-register.repository';
import { TypeOrmSalesRegisterRepository } from './infrastructure/persistence/typeorm-sales-register.repository';
import { GetSalesRegisterSummaryUseCase } from './application/use-cases/get-sales-register-summary.use-case';
import { SalesRegisterController } from './presentation/controllers/sales-register.controller';

/**
 * "Gestión de Caja de Ventas" — pure read-side, cross-cutting module, same
 * architectural precedent as `ReportsModule`/`DashboardModule` (see either
 * module's own doc comment): never writes anything, registers
 * `SaleOrmEntity`/`SaleDetailOrmEntity` a second time via its own
 * `TypeOrmModule.forFeature(...)` rather than importing `SalesModule`
 * wholesale — this is the "a new read view spans tables several other
 * modules already own" case those two modules already established the
 * pattern for, not a reason to add dashboard-style aggregation code
 * directly inside the transactional `SalesModule`.
 */
@Module({
  imports: [TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity])],
  controllers: [SalesRegisterController],
  providers: [
    {
      provide: SALES_REGISTER_REPOSITORY,
      useClass: TypeOrmSalesRegisterRepository,
    },
    GetSalesRegisterSummaryUseCase,
  ],
})
export class SalesRegisterModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesCashBoxMovementOrmEntity } from './infrastructure/persistence/sales-cash-box-movement.orm-entity';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from './domain/repositories/sales-cash-box-movement.repository';
import { TypeOrmSalesCashBoxRepository } from './infrastructure/persistence/typeorm-sales-cash-box.repository';
import { GetSalesCashBoxBalancesUseCase } from './application/use-cases/get-sales-cash-box-balances.use-case';
import { GetSalesCashBoxMovementsUseCase } from './application/use-cases/get-sales-cash-box-movements.use-case';
import { RegisterSalesCashBoxContributionUseCase } from './application/use-cases/register-sales-cash-box-contribution.use-case';
import { RegisterSalesCashBoxWithdrawalUseCase } from './application/use-cases/register-sales-cash-box-withdrawal.use-case';
import { VoidSalesCashBoxMovementUseCase } from './application/use-cases/void-sales-cash-box-movement.use-case';
import { SalesCashBoxController } from './presentation/controllers/sales-cash-box.controller';

/**
 * "Caja de Ventas" — módulo completamente independiente (propio domain/
 * application/infrastructure/presentation, sin importar `SalesModule`),
 * mismo patrón que `RechargeCashBoxModule`. Solo LEE `sale_details`/`sales`
 * (vía SQL crudo en `TypeOrmSalesCashBoxRepository.getBalances`, no
 * registrando esas entidades en `forFeature` — no se necesitan como
 * `Repository<T>` inyectado, solo como texto de tabla en el query) —
 * nunca escribe en ellas. `sales_cash_box_movements` es la única tabla
 * propia de este módulo.
 */
@Module({
  imports: [TypeOrmModule.forFeature([SalesCashBoxMovementOrmEntity])],
  controllers: [SalesCashBoxController],
  providers: [
    {
      provide: SALES_CASH_BOX_MOVEMENT_REPOSITORY,
      useClass: TypeOrmSalesCashBoxRepository,
    },
    GetSalesCashBoxBalancesUseCase,
    GetSalesCashBoxMovementsUseCase,
    RegisterSalesCashBoxContributionUseCase,
    RegisterSalesCashBoxWithdrawalUseCase,
    VoidSalesCashBoxMovementUseCase,
  ],
})
export class SalesCashBoxModule {}

import { Module } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from './domain/repositories/guayacan-cash-box.repository';
import { TypeOrmGuayacanCashBoxRepository } from './infrastructure/persistence/typeorm-guayacan-cash-box.repository';
import { GetGuayacanCashBoxSummaryUseCase } from './application/use-cases/get-guayacan-cash-box-summary.use-case';
import { ListGuayacanCashMovementsUseCase } from './application/use-cases/list-guayacan-cash-movements.use-case';
import { GetGuayacanCashMovementUseCase } from './application/use-cases/get-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashMovementUseCase } from './application/use-cases/register-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashAdjustmentUseCase } from './application/use-cases/register-guayacan-cash-adjustment.use-case';
import { VoidGuayacanCashMovementUseCase } from './application/use-cases/void-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashCountUseCase } from './application/use-cases/register-guayacan-cash-count.use-case';
import { GetLatestGuayacanCashCountUseCase } from './application/use-cases/get-latest-guayacan-cash-count.use-case';
import { ListGuayacanCashCountsUseCase } from './application/use-cases/list-guayacan-cash-counts.use-case';
import { GetGuayacanCashCountUseCase } from './application/use-cases/get-guayacan-cash-count.use-case';
import { ListGuayacanCashCountUsersUseCase } from './application/use-cases/list-guayacan-cash-count-users.use-case';
import { ListGuayacanCommissionsUseCase } from './application/use-cases/list-guayacan-commissions.use-case';
import { GuayacanCashBoxController } from './presentation/controllers/guayacan-cash-box.controller';

/**
 * "Cuadre de Caja Guayacán" — módulo independiente (no importa
 * `BankDepositsModule`; solo LEE `bank_deposit_operations` para contar
 * transacciones). Su ledger `guayacan_cash_movements` solo lo escriben las
 * funciones SQL de la migración `CreateGuayacanCashBox` — las comisiones,
 * por el trigger sobre `bank_deposit_operations`, en la misma transacción
 * que la operación.
 */
@Module({
  controllers: [GuayacanCashBoxController],
  providers: [
    {
      provide: GUAYACAN_CASH_BOX_REPOSITORY,
      useClass: TypeOrmGuayacanCashBoxRepository,
    },
    GetGuayacanCashBoxSummaryUseCase,
    ListGuayacanCashMovementsUseCase,
    GetGuayacanCashMovementUseCase,
    RegisterGuayacanCashMovementUseCase,
    RegisterGuayacanCashAdjustmentUseCase,
    VoidGuayacanCashMovementUseCase,
    RegisterGuayacanCashCountUseCase,
    GetLatestGuayacanCashCountUseCase,
    ListGuayacanCashCountsUseCase,
    GetGuayacanCashCountUseCase,
    ListGuayacanCashCountUsersUseCase,
    ListGuayacanCommissionsUseCase,
  ],
})
export class GuayacanCashBoxModule {}

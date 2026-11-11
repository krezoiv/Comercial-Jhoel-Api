import { Module } from '@nestjs/common';
import { BanksModule } from '../banks/banks.module';
import { RegisterCashBankDepositUseCase } from './application/use-cases/register-cash-bank-deposit.use-case';
import { CASH_CONTROL_REPOSITORY } from './domain/repositories/cash-control.repository';
import { TypeOrmCashControlRepository } from './infrastructure/persistence/typeorm-cash-control.repository';
import { GetCashPositionUseCase } from './application/use-cases/get-cash-position.use-case';
import {
  GetCashBalanceUseCase,
  GetCashBankBalancesUseCase,
  GetCashMovementUseCase,
  GetRecentCashMovementsUseCase,
  ListCashMovementsUseCase,
  ListCashBankDaysUseCase,
  GetCashBankDayUseCase,
  ListCashUsersUseCase,
} from './application/use-cases/cash-movement-queries.use-cases';
import {
  RegisterCashMovementUseCase,
  VoidCashMovementUseCase,
} from './application/use-cases/cash-movement-commands.use-cases';
import {
  CloseCashDayUseCase,
  FinishCashCutUseCase,
  OpenCashDayUseCase,
  ReopenCashCutUseCase,
  StartCashCutUseCase,
  UpdateCashCutScheduleUseCase,
} from './application/use-cases/cash-cut-commands.use-cases';
import {
  GetCashCutDetailUseCase,
  ListCashDaysUseCase,
} from './application/use-cases/cash-cut-queries.use-cases';
import { CashControlController } from './presentation/controllers/cash-control.controller';

/**
 * Finance → Control de Efectivo: the single official physical-cash Kardex
 * (`cash_movements`), the operational-day opening/closing and the two daily
 * cuts. Transaccionar, Cartera (CxC/Activos) and Transferencias Bancarias
 * feed the Kardex through database triggers in the same transaction as
 * their own write — this module never has to be called by them. It exports
 * the repository token so `BankDepositsModule` can return the cash movement
 * an operation produced.
 */
@Module({
  // DAY_OPENING_REPOSITORY: a bank deposit, like every balance-moving bank operation, needs the day open.
  imports: [BanksModule],
  controllers: [CashControlController],
  providers: [
    {
      provide: CASH_CONTROL_REPOSITORY,
      useClass: TypeOrmCashControlRepository,
    },
    GetCashPositionUseCase,
    GetCashBalanceUseCase,
    ListCashMovementsUseCase,
    ListCashBankDaysUseCase,
    GetCashBankDayUseCase,
    GetRecentCashMovementsUseCase,
    GetCashMovementUseCase,
    ListCashUsersUseCase,
    GetCashBankBalancesUseCase,
    RegisterCashMovementUseCase,
    VoidCashMovementUseCase,
    OpenCashDayUseCase,
    UpdateCashCutScheduleUseCase,
    StartCashCutUseCase,
    FinishCashCutUseCase,
    ReopenCashCutUseCase,
    CloseCashDayUseCase,
    ListCashDaysUseCase,
    GetCashCutDetailUseCase,
    RegisterCashBankDepositUseCase,
  ],
  exports: [CASH_CONTROL_REPOSITORY],
})
export class CashControlModule {}

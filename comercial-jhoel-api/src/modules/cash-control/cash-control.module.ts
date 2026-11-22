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
import { CashCustodyController } from './presentation/controllers/cash-custody.controller';
import { CASH_CUSTODY_REPOSITORY } from './domain/repositories/cash-custody.repository';
import { TypeOrmCashCustodyRepository } from './infrastructure/persistence/typeorm-cash-custody.repository';
import {
  GetCashCountUseCase,
  GetLatestCashCountUseCase,
  GetCashInventoryUseCase,
  RegisterWarehouseCashCountUseCase,
  ListWarehouseCashCountsUseCase,
  RegisterWarehouseCashAuditUseCase,
  ListWarehouseCashAuditsUseCase,
  GetWarehouseCashAuditUseCase,
  GetCashCountDraftUseCase,
  SaveCashCountDraftUseCase,
  DiscardCashCountDraftUseCase,
  ListCustodyTransfersUseCase,
  GetCashCustodyUseCase,
  GetWarehouseTransferUseCase,
  ListCashCountsUseCase,
  ListWarehouseMovementsUseCase,
  ListWarehouseTransfersUseCase,
  RegisterCashCountUseCase,
  RegisterWarehouseInitialBalanceUseCase,
  RegisterWarehouseTransferUseCase,
  VoidWarehouseTransferUseCase,
  GetWarehouseWithdrawalUseCase,
  ListWarehouseWithdrawalsUseCase,
  RegisterWarehouseWithdrawalUseCase,
  VoidWarehouseWithdrawalUseCase,
} from './application/use-cases/cash-custody.use-cases';
import {
  ExportCashStatementUseCase,
  GetCashStatementUseCase,
  ListCashStatementDaysUseCase,
} from './application/use-cases/cash-statement.use-cases';
import { CASH_STATEMENT_REPOSITORY } from './domain/repositories/cash-statement.repository';
import { TypeOrmCashStatementRepository } from './infrastructure/persistence/typeorm-cash-statement.repository';
import { CashStatementController } from './presentation/controllers/cash-statement.controller';
import { CashIntegrityController } from './presentation/controllers/cash-integrity.controller';
import { CASH_INTEGRITY_REPOSITORY } from './domain/repositories/cash-integrity.repository';
import { TypeOrmCashIntegrityRepository } from './infrastructure/persistence/typeorm-cash-integrity.repository';
import {
  GetCashIntegrityUseCase,
  GetOpeningStatusUseCase,
  ListIntegrityMovementsUseCase,
  RegisterOpeningCountUseCase,
  ResolveCountDifferenceUseCase,
} from './application/use-cases/cash-integrity.use-cases';

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
  // CashStatementController first: its fixed `cash-control/statement/*` paths never meet a `:param` route.
  controllers: [
    CashStatementController,
    CashIntegrityController,
    CashControlController,
    CashCustodyController,
  ],
  providers: [
    {
      provide: CASH_CONTROL_REPOSITORY,
      useClass: TypeOrmCashControlRepository,
    },
    // Arqueo de Caja + Bodega (caja → Bodega internal transfers).
    {
      provide: CASH_CUSTODY_REPOSITORY,
      useClass: TypeOrmCashCustodyRepository,
    },
    // Estado de Cuenta de Efectivo (read-only over the Kardex).
    {
      provide: CASH_STATEMENT_REPOSITORY,
      useClass: TypeOrmCashStatementRepository,
    },
    GetCashStatementUseCase,
    ListCashStatementDaysUseCase,
    ExportCashStatementUseCase,
    // Auditoría de efectivo + arqueo de apertura + resoluciones (read-only checks).
    {
      provide: CASH_INTEGRITY_REPOSITORY,
      useClass: TypeOrmCashIntegrityRepository,
    },
    GetCashIntegrityUseCase,
    ListIntegrityMovementsUseCase,
    GetOpeningStatusUseCase,
    RegisterOpeningCountUseCase,
    ResolveCountDifferenceUseCase,
    GetCashCustodyUseCase,
    RegisterCashCountUseCase,
    ListCashCountsUseCase,
    GetCashCountUseCase,
    GetLatestCashCountUseCase,
    GetCashInventoryUseCase,
    RegisterWarehouseCashCountUseCase,
    ListWarehouseCashCountsUseCase,
    RegisterWarehouseCashAuditUseCase,
    ListWarehouseCashAuditsUseCase,
    GetWarehouseCashAuditUseCase,
    GetCashCountDraftUseCase,
    SaveCashCountDraftUseCase,
    DiscardCashCountDraftUseCase,
    ListCustodyTransfersUseCase,
    RegisterWarehouseTransferUseCase,
    VoidWarehouseTransferUseCase,
    ListWarehouseTransfersUseCase,
    GetWarehouseTransferUseCase,
    RegisterWarehouseInitialBalanceUseCase,
    ListWarehouseMovementsUseCase,
    RegisterWarehouseWithdrawalUseCase,
    VoidWarehouseWithdrawalUseCase,
    ListWarehouseWithdrawalsUseCase,
    GetWarehouseWithdrawalUseCase,
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankOrmEntity } from './infrastructure/persistence/bank.orm-entity';
import { BankBalanceOrmEntity } from './infrastructure/persistence/bank-balance.orm-entity';
import { AgentReconciliationOrmEntity } from './infrastructure/persistence/agent-reconciliation.orm-entity';
import { DayOpeningOrmEntity } from './infrastructure/persistence/day-opening.orm-entity';
import { DayAuditLogOrmEntity } from './infrastructure/persistence/day-audit-log.orm-entity';
import { TypeOrmBankRepository } from './infrastructure/persistence/typeorm-bank.repository';
import { TypeOrmBankBalanceRepository } from './infrastructure/persistence/typeorm-bank-balance.repository';
import { TypeOrmAgentReconciliationRepository } from './infrastructure/persistence/typeorm-agent-reconciliation.repository';
import { TypeOrmDayOpeningRepository } from './infrastructure/persistence/typeorm-day-opening.repository';
import { TypeOrmDayAuditLogRepository } from './infrastructure/persistence/typeorm-day-audit-log.repository';
import { TypeOrmBankMovementRepository } from './infrastructure/persistence/typeorm-bank-movement.repository';
import { BANK_REPOSITORY } from './domain/repositories/bank.repository';
import { BANK_BALANCE_REPOSITORY } from './domain/repositories/bank-balance.repository';
import { AGENT_RECONCILIATION_REPOSITORY } from './domain/repositories/agent-reconciliation.repository';
import { DAY_OPENING_REPOSITORY } from './domain/repositories/day-opening.repository';
import { DAY_AUDIT_LOG_REPOSITORY } from './domain/repositories/day-audit-log.repository';
import { BANK_MOVEMENT_REPOSITORY } from './domain/repositories/bank-movement.repository';
import { CreateBankUseCase } from './application/use-cases/create-bank.use-case';
import { ListBanksUseCase } from './application/use-cases/list-banks.use-case';
import { GetBankByIdUseCase } from './application/use-cases/get-bank-by-id.use-case';
import { UpdateBankUseCase } from './application/use-cases/update-bank.use-case';
import { DeactivateBankUseCase } from './application/use-cases/deactivate-bank.use-case';
import { GetBankBalancesViewUseCase } from './application/use-cases/get-bank-balances-view.use-case';
import { SaveBankBalancesUseCase } from './application/use-cases/save-bank-balances.use-case';
import { GetCuadreAgentesSummaryUseCase } from './application/use-cases/get-cuadre-agentes-summary.use-case';
import { ValidateBankBalancesForDateUseCase } from './application/use-cases/validate-bank-balances-for-date.use-case';
import { GetDayStatusUseCase } from './application/use-cases/get-day-status.use-case';
import { OpenDayUseCase } from './application/use-cases/open-day.use-case';
import { CloseAgentDayUseCase } from './application/use-cases/close-agent-day.use-case';
import { ListClosedDaysUseCase } from './application/use-cases/list-closed-days.use-case';
import { GetDayDetailUseCase } from './application/use-cases/get-day-detail.use-case';
import { ReopenDayUseCase } from './application/use-cases/reopen-day.use-case';
import { CancelDayUseCase } from './application/use-cases/cancel-day.use-case';
import { RegisterBankTransferUseCase } from './application/use-cases/register-bank-transfer.use-case';
import { VoidBankTransferUseCase } from './application/use-cases/void-bank-transfer.use-case';
import { ListBankTransfersUseCase } from './application/use-cases/list-bank-transfers.use-case';
import { AdjustBankBalanceUseCase } from './application/use-cases/adjust-bank-balance.use-case';
import { ListBankMovementsUseCase } from './application/use-cases/list-bank-movements.use-case';
import { BanksController } from './presentation/controllers/banks.controller';
import { AgentReconciliationsController } from './presentation/controllers/agent-reconciliations.controller';
import { ClosedDaysController } from './presentation/controllers/closed-days.controller';
import { BankTransfersController } from './presentation/controllers/bank-transfers.controller';
import { AccountTypesModule } from '../account-types/account-types.module';
import { AssetsModule } from '../assets/assets.module';
import { AccountsReceivableModule } from '../accounts-receivable/accounts-receivable.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankOrmEntity,
      BankBalanceOrmEntity,
      AgentReconciliationOrmEntity,
      DayOpeningOrmEntity,
      DayAuditLogOrmEntity,
    ]),
    AccountTypesModule,
    // Cuadre Agentes (primera etapa) reads each module's own repository
    // directly — see `GetCuadreAgentesSummaryUseCase`'s own doc comment —
    // rather than duplicating the SUM(amount) query it already exposes.
    AssetsModule,
    AccountsReceivableModule,
  ],
  controllers: [
    BanksController,
    AgentReconciliationsController,
    ClosedDaysController,
    BankTransfersController,
  ],
  providers: [
    { provide: BANK_REPOSITORY, useClass: TypeOrmBankRepository },
    {
      provide: BANK_BALANCE_REPOSITORY,
      useClass: TypeOrmBankBalanceRepository,
    },
    {
      provide: AGENT_RECONCILIATION_REPOSITORY,
      useClass: TypeOrmAgentReconciliationRepository,
    },
    {
      provide: DAY_OPENING_REPOSITORY,
      useClass: TypeOrmDayOpeningRepository,
    },
    {
      provide: DAY_AUDIT_LOG_REPOSITORY,
      useClass: TypeOrmDayAuditLogRepository,
    },
    {
      provide: BANK_MOVEMENT_REPOSITORY,
      useClass: TypeOrmBankMovementRepository,
    },
    CreateBankUseCase,
    ListBanksUseCase,
    GetBankByIdUseCase,
    UpdateBankUseCase,
    DeactivateBankUseCase,
    GetBankBalancesViewUseCase,
    SaveBankBalancesUseCase,
    GetCuadreAgentesSummaryUseCase,
    ValidateBankBalancesForDateUseCase,
    GetDayStatusUseCase,
    OpenDayUseCase,
    CloseAgentDayUseCase,
    ListClosedDaysUseCase,
    GetDayDetailUseCase,
    ReopenDayUseCase,
    CancelDayUseCase,
    RegisterBankTransferUseCase,
    VoidBankTransferUseCase,
    ListBankTransfersUseCase,
    AdjustBankBalanceUseCase,
    ListBankMovementsUseCase,
  ],
  // DAY_OPENING_REPOSITORY exported for BankDepositsModule (Transaccionar),
  // which reuses the exact same "día abierto/cerrado" business-day cycle
  // this module owns rather than duplicating a parallel one — Transaccionar
  // deposits are gated by the same daily close as Cuadre de Agentes.
  // BANK_MOVEMENT_REPOSITORY: Transaccionar lee el movimiento de saldo que
  // generó una operación; ListBankMovementsUseCase: Reportería (movimientos).
  exports: [
    BANK_REPOSITORY,
    DAY_OPENING_REPOSITORY,
    BANK_MOVEMENT_REPOSITORY,
    ListBankMovementsUseCase,
  ],
})
export class BanksModule {}

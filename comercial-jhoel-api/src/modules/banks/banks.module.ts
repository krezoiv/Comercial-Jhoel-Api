import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankOrmEntity } from './infrastructure/persistence/bank.orm-entity';
import { BankBalanceOrmEntity } from './infrastructure/persistence/bank-balance.orm-entity';
import { AgentReconciliationOrmEntity } from './infrastructure/persistence/agent-reconciliation.orm-entity';
import { TypeOrmBankRepository } from './infrastructure/persistence/typeorm-bank.repository';
import { TypeOrmBankBalanceRepository } from './infrastructure/persistence/typeorm-bank-balance.repository';
import { TypeOrmAgentReconciliationRepository } from './infrastructure/persistence/typeorm-agent-reconciliation.repository';
import { BANK_REPOSITORY } from './domain/repositories/bank.repository';
import { BANK_BALANCE_REPOSITORY } from './domain/repositories/bank-balance.repository';
import { AGENT_RECONCILIATION_REPOSITORY } from './domain/repositories/agent-reconciliation.repository';
import { CreateBankUseCase } from './application/use-cases/create-bank.use-case';
import { ListBanksUseCase } from './application/use-cases/list-banks.use-case';
import { GetBankByIdUseCase } from './application/use-cases/get-bank-by-id.use-case';
import { UpdateBankUseCase } from './application/use-cases/update-bank.use-case';
import { DeactivateBankUseCase } from './application/use-cases/deactivate-bank.use-case';
import { GetBankBalancesViewUseCase } from './application/use-cases/get-bank-balances-view.use-case';
import { SaveBankBalancesUseCase } from './application/use-cases/save-bank-balances.use-case';
import { GetCuadreAgentesSummaryUseCase } from './application/use-cases/get-cuadre-agentes-summary.use-case';
import { CreateAgentReconciliationUseCase } from './application/use-cases/create-agent-reconciliation.use-case';
import { BanksController } from './presentation/controllers/banks.controller';
import { AgentReconciliationsController } from './presentation/controllers/agent-reconciliations.controller';
import { AccountTypesModule } from '../account-types/account-types.module';
import { AssetsModule } from '../assets/assets.module';
import { AccountsReceivableModule } from '../accounts-receivable/accounts-receivable.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankOrmEntity,
      BankBalanceOrmEntity,
      AgentReconciliationOrmEntity,
    ]),
    AccountTypesModule,
    // Cuadre Agentes (primera etapa) reads each module's own repository
    // directly — see `GetCuadreAgentesSummaryUseCase`'s own doc comment —
    // rather than duplicating the SUM(amount) query it already exposes.
    AssetsModule,
    AccountsReceivableModule,
  ],
  controllers: [BanksController, AgentReconciliationsController],
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
    CreateBankUseCase,
    ListBanksUseCase,
    GetBankByIdUseCase,
    UpdateBankUseCase,
    DeactivateBankUseCase,
    GetBankBalancesViewUseCase,
    SaveBankBalancesUseCase,
    GetCuadreAgentesSummaryUseCase,
    CreateAgentReconciliationUseCase,
  ],
  exports: [BANK_REPOSITORY],
})
export class BanksModule {}

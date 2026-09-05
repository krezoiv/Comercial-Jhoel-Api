import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { AccountReceivableOrmEntity } from './infrastructure/persistence/account-receivable.orm-entity';
import { TypeOrmAccountReceivableRepository } from './infrastructure/persistence/typeorm-account-receivable.repository';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from './domain/repositories/account-receivable.repository';
import { CreateAccountReceivableUseCase } from './application/use-cases/create-account-receivable.use-case';
import { ListAccountsReceivableUseCase } from './application/use-cases/list-accounts-receivable.use-case';
import { GetAccountReceivableByIdUseCase } from './application/use-cases/get-account-receivable-by-id.use-case';
import { UpdateAccountReceivableUseCase } from './application/use-cases/update-account-receivable.use-case';
import { DeactivateAccountReceivableUseCase } from './application/use-cases/deactivate-account-receivable.use-case';
import { RegisterAccountReceivableChargeUseCase } from './application/use-cases/register-account-receivable-charge.use-case';
import { RegisterAccountReceivablePaymentUseCase } from './application/use-cases/register-account-receivable-payment.use-case';
import { GetAccountReceivableStatementUseCase } from './application/use-cases/get-account-receivable-statement.use-case';
import { GetAccountReceivableCurrentBalanceUseCase } from './application/use-cases/get-account-receivable-current-balance.use-case';
import { GetAccountReceivableActiveBalanceUseCase } from './application/use-cases/get-account-receivable-active-balance.use-case';
import { AccountsReceivableController } from './presentation/controllers/accounts-receivable.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountReceivableOrmEntity]),
    ClientsModule,
  ],
  controllers: [AccountsReceivableController],
  providers: [
    {
      provide: ACCOUNT_RECEIVABLE_REPOSITORY,
      useClass: TypeOrmAccountReceivableRepository,
    },
    CreateAccountReceivableUseCase,
    ListAccountsReceivableUseCase,
    GetAccountReceivableByIdUseCase,
    UpdateAccountReceivableUseCase,
    DeactivateAccountReceivableUseCase,
    RegisterAccountReceivableChargeUseCase,
    RegisterAccountReceivablePaymentUseCase,
    GetAccountReceivableStatementUseCase,
    GetAccountReceivableCurrentBalanceUseCase,
    GetAccountReceivableActiveBalanceUseCase,
  ],
  // Exported for ReportsModule's Cuentas por Cobrar report: ACCOUNT_RECEIVABLE_REPOSITORY
  // backs its own summary use case, and ListAccountsReceivableUseCase is reused directly
  // for the report's list endpoint — identical filtering/pagination, no reason to
  // duplicate it. Same reuse-over-duplicate reasoning as RechargesModule's own exports.
  exports: [ACCOUNT_RECEIVABLE_REPOSITORY, ListAccountsReceivableUseCase],
})
export class AccountsReceivableModule {}

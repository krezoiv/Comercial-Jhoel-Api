import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankDepositOperationOrmEntity } from './infrastructure/persistence/bank-deposit-operation.orm-entity';
import { BankDepositCashDetailOrmEntity } from './infrastructure/persistence/bank-deposit-cash-detail.orm-entity';
import { BankDepositTransactionOrmEntity } from './infrastructure/persistence/bank-deposit-transaction.orm-entity';
import { TypeOrmBankDepositRepository } from './infrastructure/persistence/typeorm-bank-deposit.repository';
import { BANK_DEPOSIT_REPOSITORY } from './domain/repositories/bank-deposit.repository';
import { RegisterBankDepositOperationUseCase } from './application/use-cases/register-bank-deposit-operation.use-case';
import { ListBankDepositOperationsUseCase } from './application/use-cases/list-bank-deposit-operations.use-case';
import { GetBankDepositOperationByIdUseCase } from './application/use-cases/get-bank-deposit-operation-by-id.use-case';
import { VoidBankDepositOperationUseCase } from './application/use-cases/void-bank-deposit-operation.use-case';
import { GetBankDepositMonthlyCountUseCase } from './application/use-cases/get-bank-deposit-monthly-count.use-case';
import { GetBankDepositTransactionSummaryUseCase } from './application/use-cases/get-bank-deposit-transaction-summary.use-case';
import { GetBankDepositDailyStatsUseCase } from './application/use-cases/get-bank-deposit-daily-stats.use-case';
import { BankDepositsController } from './presentation/controllers/bank-deposits.controller';
import { TransactionBanksModule } from '../transaction-banks/transaction-banks.module';
import { TransactionTypesModule } from '../transaction-types/transaction-types.module';
import { BanksModule } from '../banks/banks.module';
import { ClientsModule } from '../clients/clients.module';
import { AccountsReceivableModule } from '../accounts-receivable/accounts-receivable.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankDepositOperationOrmEntity,
      BankDepositCashDetailOrmEntity,
      BankDepositTransactionOrmEntity,
    ]),
    // Validates transactionBankId the same way PurchasesModule reaches SuppliersModule.
    TransactionBanksModule,
    // For the TransactionTypeOrmEntity relation (eager-loaded on BankDepositOperationOrmEntity)
    // and, since the "Enviar a cuentas por cobrar" follow-up, to resolve/confirm a transaction
    // type's name really is "Depósito" before allowing that flow.
    TransactionTypesModule,
    // For DAY_OPENING_REPOSITORY — Transaccionar reuses Banks' own día-abierto/cerrado
    // cycle rather than a parallel one, see RegisterBankDepositOperationUseCase.
    BanksModule,
    // Validates a deposit's optional registered clientId the same way PurchasesModule
    // reaches SuppliersModule — added for "Enviar a cuentas por cobrar".
    ClientsModule,
    // For RegisterAccountReceivableChargeUseCase — reused as-is when a deposit is sent
    // to Cuentas por Cobrar, rather than duplicating its validation/SQL call.
    AccountsReceivableModule,
    // For TRANSACTION_MANAGER — lets the deposit + its optional CxC cargo commit or
    // roll back atomically in one DB transaction.
    SharedModule,
  ],
  controllers: [BankDepositsController],
  providers: [
    {
      provide: BANK_DEPOSIT_REPOSITORY,
      useClass: TypeOrmBankDepositRepository,
    },
    RegisterBankDepositOperationUseCase,
    ListBankDepositOperationsUseCase,
    GetBankDepositOperationByIdUseCase,
    VoidBankDepositOperationUseCase,
    GetBankDepositMonthlyCountUseCase,
    GetBankDepositTransactionSummaryUseCase,
    GetBankDepositDailyStatsUseCase,
  ],
  // Exported for ReportsModule — BankDepositsReportController reuses
  // ListBankDepositOperationsUseCase directly for its listing route,
  // identical to how RechargesReportController reuses GetRechargeHistoryUseCase.
  exports: [BANK_DEPOSIT_REPOSITORY, ListBankDepositOperationsUseCase],
})
export class BankDepositsModule {}

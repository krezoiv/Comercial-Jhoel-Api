import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionBankOrmEntity } from './infrastructure/persistence/transaction-bank.orm-entity';
import { TypeOrmTransactionBankRepository } from './infrastructure/persistence/typeorm-transaction-bank.repository';
import { TRANSACTION_BANK_REPOSITORY } from './domain/repositories/transaction-bank.repository';
import { CreateTransactionBankUseCase } from './application/use-cases/create-transaction-bank.use-case';
import { ListTransactionBanksUseCase } from './application/use-cases/list-transaction-banks.use-case';
import { GetTransactionBankByIdUseCase } from './application/use-cases/get-transaction-bank-by-id.use-case';
import { UpdateTransactionBankUseCase } from './application/use-cases/update-transaction-bank.use-case';
import { DeactivateTransactionBankUseCase } from './application/use-cases/deactivate-transaction-bank.use-case';
import { TransactionBanksController } from './presentation/controllers/transaction-banks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionBankOrmEntity])],
  controllers: [TransactionBanksController],
  providers: [
    {
      provide: TRANSACTION_BANK_REPOSITORY,
      useClass: TypeOrmTransactionBankRepository,
    },
    CreateTransactionBankUseCase,
    ListTransactionBanksUseCase,
    GetTransactionBankByIdUseCase,
    UpdateTransactionBankUseCase,
    DeactivateTransactionBankUseCase,
  ],
  // Exported for BankDepositsModule, which resolves/validates transactionBankId
  // the same way ProductsModule reaches CategoriesModule.
  exports: [TRANSACTION_BANK_REPOSITORY],
})
export class TransactionBanksModule {}

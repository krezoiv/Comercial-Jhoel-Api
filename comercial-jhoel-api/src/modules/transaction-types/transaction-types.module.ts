import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionTypeOrmEntity } from './infrastructure/persistence/transaction-type.orm-entity';
import { TypeOrmTransactionTypeRepository } from './infrastructure/persistence/typeorm-transaction-type.repository';
import { TRANSACTION_TYPE_REPOSITORY } from './domain/repositories/transaction-type.repository';
import { CreateTransactionTypeUseCase } from './application/use-cases/create-transaction-type.use-case';
import { ListTransactionTypesUseCase } from './application/use-cases/list-transaction-types.use-case';
import { GetTransactionTypeByIdUseCase } from './application/use-cases/get-transaction-type-by-id.use-case';
import { UpdateTransactionTypeUseCase } from './application/use-cases/update-transaction-type.use-case';
import { DeactivateTransactionTypeUseCase } from './application/use-cases/deactivate-transaction-type.use-case';
import { TransactionTypesController } from './presentation/controllers/transaction-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionTypeOrmEntity])],
  controllers: [TransactionTypesController],
  providers: [
    {
      provide: TRANSACTION_TYPE_REPOSITORY,
      useClass: TypeOrmTransactionTypeRepository,
    },
    CreateTransactionTypeUseCase,
    ListTransactionTypesUseCase,
    GetTransactionTypeByIdUseCase,
    UpdateTransactionTypeUseCase,
    DeactivateTransactionTypeUseCase,
  ],
  // Exported for BankDepositsModule, which resolves/validates transactionTypeId
  // the same way ProductsModule reaches CategoriesModule.
  exports: [TRANSACTION_TYPE_REPOSITORY],
})
export class TransactionTypesModule {}

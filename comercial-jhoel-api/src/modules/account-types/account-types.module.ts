import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTypeOrmEntity } from './infrastructure/persistence/account-type.orm-entity';
import { TypeOrmAccountTypeRepository } from './infrastructure/persistence/typeorm-account-type.repository';
import { ACCOUNT_TYPE_REPOSITORY } from './domain/repositories/account-type.repository';
import { CreateAccountTypeUseCase } from './application/use-cases/create-account-type.use-case';
import { ListAccountTypesUseCase } from './application/use-cases/list-account-types.use-case';
import { GetAccountTypeByIdUseCase } from './application/use-cases/get-account-type-by-id.use-case';
import { UpdateAccountTypeUseCase } from './application/use-cases/update-account-type.use-case';
import { DeactivateAccountTypeUseCase } from './application/use-cases/deactivate-account-type.use-case';
import { AccountTypesController } from './presentation/controllers/account-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTypeOrmEntity])],
  controllers: [AccountTypesController],
  providers: [
    {
      provide: ACCOUNT_TYPE_REPOSITORY,
      useClass: TypeOrmAccountTypeRepository,
    },
    CreateAccountTypeUseCase,
    ListAccountTypesUseCase,
    GetAccountTypeByIdUseCase,
    UpdateAccountTypeUseCase,
    DeactivateAccountTypeUseCase,
  ],
  // Exported for BanksModule, which resolves accountTypeId into a display
  // name/active-check the same way ProductsModule reaches CategoriesModule.
  exports: [ACCOUNT_TYPE_REPOSITORY],
})
export class AccountTypesModule {}

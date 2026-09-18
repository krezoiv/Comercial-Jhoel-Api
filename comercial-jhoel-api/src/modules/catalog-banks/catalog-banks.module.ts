import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogBankOrmEntity } from './infrastructure/persistence/catalog-bank.orm-entity';
import { TypeOrmCatalogBankRepository } from './infrastructure/persistence/typeorm-catalog-bank.repository';
import { CATALOG_BANK_REPOSITORY } from './domain/repositories/catalog-bank.repository';
import { CreateCatalogBankUseCase } from './application/use-cases/create-catalog-bank.use-case';
import { UpdateCatalogBankUseCase } from './application/use-cases/update-catalog-bank.use-case';
import { ListCatalogBanksUseCase } from './application/use-cases/list-catalog-banks.use-case';
import { GetCatalogBankByIdUseCase } from './application/use-cases/get-catalog-bank-by-id.use-case';
import { SetCatalogBankActiveUseCase } from './application/use-cases/set-catalog-bank-active.use-case';
import { ReorderCatalogBanksUseCase } from './application/use-cases/reorder-catalog-banks.use-case';
import { SetCatalogBankImageUseCase } from './application/use-cases/set-catalog-bank-image.use-case';
import { RemoveCatalogBankImageUseCase } from './application/use-cases/remove-catalog-bank-image.use-case';
import { ListPublishedCatalogBanksUseCase } from './application/use-cases/list-published-catalog-banks.use-case';
import { GetPublishedCatalogBankByIdUseCase } from './application/use-cases/get-published-catalog-bank-by-id.use-case';
import { GetCatalogBankImageUseCase } from './application/use-cases/get-catalog-bank-image.use-case';
import { CatalogBanksController } from './presentation/controllers/catalog-banks.controller';
import { PublicCatalogBanksController } from './presentation/controllers/public-catalog-banks.controller';

/**
 * "Catálogo de Bancos" — catálogo público informativo, completamente
 * independiente de `modules/banks/` (financiero, Cuadre de Agentes),
 * `modules/transaction-banks/` y `modules/bank-deposits/`. Sin producto,
 * sin cuentas, sin saldos, sin movimientos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([CatalogBankOrmEntity])],
  controllers: [CatalogBanksController, PublicCatalogBanksController],
  providers: [
    { provide: CATALOG_BANK_REPOSITORY, useClass: TypeOrmCatalogBankRepository },
    CreateCatalogBankUseCase,
    UpdateCatalogBankUseCase,
    ListCatalogBanksUseCase,
    GetCatalogBankByIdUseCase,
    SetCatalogBankActiveUseCase,
    ReorderCatalogBanksUseCase,
    SetCatalogBankImageUseCase,
    RemoveCatalogBankImageUseCase,
    ListPublishedCatalogBanksUseCase,
    GetPublishedCatalogBankByIdUseCase,
    GetCatalogBankImageUseCase,
  ],
})
export class CatalogBanksModule {}

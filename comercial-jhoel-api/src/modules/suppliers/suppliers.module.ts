import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierOrmEntity } from './infrastructure/persistence/supplier.orm-entity';
import { TypeOrmSupplierRepository } from './infrastructure/persistence/typeorm-supplier.repository';
import { SUPPLIER_REPOSITORY } from './domain/repositories/supplier.repository';
import { CreateSupplierUseCase } from './application/use-cases/create-supplier.use-case';
import { ListSuppliersUseCase } from './application/use-cases/list-suppliers.use-case';
import { GetSupplierByIdUseCase } from './application/use-cases/get-supplier-by-id.use-case';
import { UpdateSupplierUseCase } from './application/use-cases/update-supplier.use-case';
import { DeactivateSupplierUseCase } from './application/use-cases/deactivate-supplier.use-case';
import { SuppliersController } from './presentation/controllers/suppliers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierOrmEntity])],
  controllers: [SuppliersController],
  providers: [
    { provide: SUPPLIER_REPOSITORY, useClass: TypeOrmSupplierRepository },
    CreateSupplierUseCase,
    ListSuppliersUseCase,
    GetSupplierByIdUseCase,
    UpdateSupplierUseCase,
    DeactivateSupplierUseCase,
  ],
  exports: [SUPPLIER_REPOSITORY],
})
export class SuppliersModule {}

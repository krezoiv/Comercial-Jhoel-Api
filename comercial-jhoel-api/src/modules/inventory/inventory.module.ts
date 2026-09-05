import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLocationOrmEntity } from './infrastructure/persistence/inventory-location.orm-entity';
import { ProductPresentationOrmEntity } from './infrastructure/persistence/product-presentation.orm-entity';
import { InventoryStockOrmEntity } from './infrastructure/persistence/inventory-stock.orm-entity';
import { InventoryMovementOrmEntity } from './infrastructure/persistence/inventory-movement.orm-entity';
import { TypeOrmInventoryLocationRepository } from './infrastructure/persistence/typeorm-inventory-location.repository';
import { TypeOrmProductPresentationRepository } from './infrastructure/persistence/typeorm-product-presentation.repository';
import { TypeOrmInventoryStockRepository } from './infrastructure/persistence/typeorm-inventory-stock.repository';
import { TypeOrmInventoryMovementRepository } from './infrastructure/persistence/typeorm-inventory-movement.repository';
import { TypeOrmInventoryTransferRepository } from './infrastructure/persistence/typeorm-inventory-transfer.repository';
import { INVENTORY_LOCATION_REPOSITORY } from './domain/repositories/inventory-location.repository';
import { PRODUCT_PRESENTATION_REPOSITORY } from './domain/repositories/product-presentation.repository';
import { INVENTORY_STOCK_REPOSITORY } from './domain/repositories/inventory-stock.repository';
import { INVENTORY_MOVEMENT_REPOSITORY } from './domain/repositories/inventory-movement.repository';
import { INVENTORY_TRANSFER_REPOSITORY } from './domain/repositories/inventory-transfer.repository';
import { ListInventoryLocationsUseCase } from './application/use-cases/list-inventory-locations.use-case';
import { ListProductPresentationsUseCase } from './application/use-cases/list-product-presentations.use-case';
import { CreatePresentationUseCase } from './application/use-cases/create-presentation.use-case';
import { UpdatePresentationUseCase } from './application/use-cases/update-presentation.use-case';
import { GetProductInventoryUseCase } from './application/use-cases/get-product-inventory.use-case';
import { RegisterInventoryTransferUseCase } from './application/use-cases/register-inventory-transfer.use-case';
import { SetMinStockUseCase } from './application/use-cases/set-min-stock.use-case';
import { InventoryController } from './presentation/controllers/inventory.controller';
import { ProductsModule } from '../products/products.module';
import { PresentationTypesModule } from '../presentation-types/presentation-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryLocationOrmEntity,
      ProductPresentationOrmEntity,
      InventoryStockOrmEntity,
      InventoryMovementOrmEntity,
    ]),
    forwardRef(() => ProductsModule),
    PresentationTypesModule,
  ],
  controllers: [InventoryController],
  providers: [
    {
      provide: INVENTORY_LOCATION_REPOSITORY,
      useClass: TypeOrmInventoryLocationRepository,
    },
    {
      provide: PRODUCT_PRESENTATION_REPOSITORY,
      useClass: TypeOrmProductPresentationRepository,
    },
    {
      provide: INVENTORY_STOCK_REPOSITORY,
      useClass: TypeOrmInventoryStockRepository,
    },
    {
      provide: INVENTORY_MOVEMENT_REPOSITORY,
      useClass: TypeOrmInventoryMovementRepository,
    },
    {
      provide: INVENTORY_TRANSFER_REPOSITORY,
      useClass: TypeOrmInventoryTransferRepository,
    },
    ListInventoryLocationsUseCase,
    ListProductPresentationsUseCase,
    CreatePresentationUseCase,
    UpdatePresentationUseCase,
    GetProductInventoryUseCase,
    RegisterInventoryTransferUseCase,
    SetMinStockUseCase,
  ],
  // Exported so `ProductsModule`'s own use cases (CreateProductUseCase) can
  // create a product's default "Unidad" presentation and seed its
  // inventory_stock rows without duplicating this module's repositories.
  exports: [
    PRODUCT_PRESENTATION_REPOSITORY,
    INVENTORY_STOCK_REPOSITORY,
    INVENTORY_LOCATION_REPOSITORY,
  ],
})
export class InventoryModule {}

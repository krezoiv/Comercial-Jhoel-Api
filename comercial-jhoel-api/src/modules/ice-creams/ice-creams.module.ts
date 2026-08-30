import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IceCreamOrmEntity } from './infrastructure/persistence/ice-cream.orm-entity';
import { IceCreamPurchaseOrmEntity } from './infrastructure/persistence/ice-cream-purchase.orm-entity';
import { IceCreamPurchaseDetailOrmEntity } from './infrastructure/persistence/ice-cream-purchase-detail.orm-entity';
import { IceCreamSaleOrmEntity } from './infrastructure/persistence/ice-cream-sale.orm-entity';
import { IceCreamSaleDetailOrmEntity } from './infrastructure/persistence/ice-cream-sale-detail.orm-entity';
import { TypeOrmIceCreamRepository } from './infrastructure/persistence/typeorm-ice-cream.repository';
import { TypeOrmIceCreamPurchaseRepository } from './infrastructure/persistence/typeorm-ice-cream-purchase.repository';
import { TypeOrmIceCreamSaleRepository } from './infrastructure/persistence/typeorm-ice-cream-sale.repository';
import { ICE_CREAM_REPOSITORY } from './domain/repositories/ice-cream.repository';
import { ICE_CREAM_PURCHASE_REPOSITORY } from './domain/repositories/ice-cream-purchase.repository';
import { ICE_CREAM_SALE_REPOSITORY } from './domain/repositories/ice-cream-sale.repository';
import { CreateIceCreamUseCase } from './application/use-cases/create-ice-cream.use-case';
import { ListIceCreamsUseCase } from './application/use-cases/list-ice-creams.use-case';
import { GetIceCreamByIdUseCase } from './application/use-cases/get-ice-cream-by-id.use-case';
import { UpdateIceCreamUseCase } from './application/use-cases/update-ice-cream.use-case';
import { DeactivateIceCreamUseCase } from './application/use-cases/deactivate-ice-cream.use-case';
import { CreateIceCreamPurchaseUseCase } from './application/use-cases/create-ice-cream-purchase.use-case';
import { ListIceCreamPurchasesUseCase } from './application/use-cases/list-ice-cream-purchases.use-case';
import { GetIceCreamPurchaseByIdUseCase } from './application/use-cases/get-ice-cream-purchase-by-id.use-case';
import { CreateIceCreamSaleUseCase } from './application/use-cases/create-ice-cream-sale.use-case';
import { ListIceCreamSalesUseCase } from './application/use-cases/list-ice-cream-sales.use-case';
import { GetIceCreamSaleByIdUseCase } from './application/use-cases/get-ice-cream-sale-by-id.use-case';
import { IceCreamsController } from './presentation/controllers/ice-creams.controller';
import { IceCreamPurchasesController } from './presentation/controllers/ice-cream-purchases.controller';
import { IceCreamSalesController } from './presentation/controllers/ice-cream-sales.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IceCreamOrmEntity,
      IceCreamPurchaseOrmEntity,
      IceCreamPurchaseDetailOrmEntity,
      IceCreamSaleOrmEntity,
      IceCreamSaleDetailOrmEntity,
    ]),
  ],
  controllers: [
    IceCreamsController,
    IceCreamPurchasesController,
    IceCreamSalesController,
  ],
  providers: [
    { provide: ICE_CREAM_REPOSITORY, useClass: TypeOrmIceCreamRepository },
    {
      provide: ICE_CREAM_PURCHASE_REPOSITORY,
      useClass: TypeOrmIceCreamPurchaseRepository,
    },
    {
      provide: ICE_CREAM_SALE_REPOSITORY,
      useClass: TypeOrmIceCreamSaleRepository,
    },
    CreateIceCreamUseCase,
    ListIceCreamsUseCase,
    GetIceCreamByIdUseCase,
    UpdateIceCreamUseCase,
    DeactivateIceCreamUseCase,
    CreateIceCreamPurchaseUseCase,
    ListIceCreamPurchasesUseCase,
    GetIceCreamPurchaseByIdUseCase,
    CreateIceCreamSaleUseCase,
    ListIceCreamSalesUseCase,
    GetIceCreamSaleByIdUseCase,
  ],
  // Exported for ReportsModule's ice cream sales/purchases reports, same
  // reuse-over-duplicate reasoning as ProductsModule/PurchasesModule/SalesModule.
  exports: [
    ICE_CREAM_REPOSITORY,
    ICE_CREAM_PURCHASE_REPOSITORY,
    ICE_CREAM_SALE_REPOSITORY,
  ],
})
export class IceCreamsModule {}

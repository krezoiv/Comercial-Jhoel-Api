import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeactivateProductUseCase } from './application/use-cases/deactivate-product.use-case';
import { ProductsController } from './presentation/controllers/products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity]),
    CategoriesModule,
    BusinessesModule,
  ],
  controllers: [ProductsController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    DeactivateProductUseCase,
  ],
  // Exported for ReportsModule, which resolves `productId`/`categoryId`
  // filters into display names for the PDF export.
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}

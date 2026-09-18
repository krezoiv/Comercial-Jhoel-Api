import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { LikesModule } from '../likes/likes.module';
import { CatalogProductOrmEntity } from './infrastructure/persistence/catalog-product.orm-entity';
import { CatalogProductRequestOrmEntity } from './infrastructure/persistence/catalog-product-request.orm-entity';
import { TypeOrmCatalogProductRepository } from './infrastructure/persistence/typeorm-catalog-product.repository';
import { TypeOrmCatalogProductRequestRepository } from './infrastructure/persistence/typeorm-catalog-product-request.repository';
import { CATALOG_PRODUCT_REPOSITORY } from './domain/repositories/catalog-product.repository';
import { CATALOG_PRODUCT_REQUEST_REPOSITORY } from './domain/repositories/catalog-product-request.repository';
import { CreateCatalogProductUseCase } from './application/use-cases/create-catalog-product.use-case';
import { UpdateCatalogProductUseCase } from './application/use-cases/update-catalog-product.use-case';
import { ListCatalogProductsUseCase } from './application/use-cases/list-catalog-products.use-case';
import { GetCatalogProductByIdUseCase } from './application/use-cases/get-catalog-product-by-id.use-case';
import { SetCatalogProductActiveUseCase } from './application/use-cases/set-catalog-product-active.use-case';
import { ReorderCatalogProductsUseCase } from './application/use-cases/reorder-catalog-products.use-case';
import { SetCatalogProductImageUseCase } from './application/use-cases/set-catalog-product-image.use-case';
import { RemoveCatalogProductImageUseCase } from './application/use-cases/remove-catalog-product-image.use-case';
import { ListPublishedCatalogProductsUseCase } from './application/use-cases/list-published-catalog-products.use-case';
import { GetPublishedCatalogProductByIdUseCase } from './application/use-cases/get-published-catalog-product-by-id.use-case';
import { GetCatalogProductImageUseCase } from './application/use-cases/get-catalog-product-image.use-case';
import { CreateCatalogProductRequestUseCase } from './application/use-cases/create-catalog-product-request.use-case';
import { LikeCatalogProductUseCase } from './application/use-cases/like-catalog-product.use-case';
import { ListCatalogProductRequestsUseCase } from './application/use-cases/list-catalog-product-requests.use-case';
import { GetCatalogProductRequestByIdUseCase } from './application/use-cases/get-catalog-product-request-by-id.use-case';
import { UpdateCatalogProductRequestStatusUseCase } from './application/use-cases/update-catalog-product-request-status.use-case';
import { CatalogProductsController } from './presentation/controllers/catalog-products.controller';
import { CatalogProductRequestsController } from './presentation/controllers/catalog-product-requests.controller';
import { PublicProductCatalogController } from './presentation/controllers/public-product-catalog.controller';

/**
 * "Catálogo de Librería" y "Variedades y Accesorios" — una sola sección
 * discriminada por `section`, referenciando `products.id` (nunca copia
 * datos de Inventario). Importa `ProductsModule` solo para leer/validar
 * el producto (`PRODUCT_REPOSITORY`, ya exportado — cero cambios ahí).
 * Deliberadamente sin nada de Krediya/CompanySettings — esa regla es
 * exclusiva de Teléfonos (`modules/catalog/`), nunca reutilizada aquí.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([CatalogProductOrmEntity, CatalogProductRequestOrmEntity]),
    ProductsModule,
    LikesModule,
  ],
  controllers: [
    CatalogProductsController,
    CatalogProductRequestsController,
    PublicProductCatalogController,
  ],
  providers: [
    { provide: CATALOG_PRODUCT_REPOSITORY, useClass: TypeOrmCatalogProductRepository },
    { provide: CATALOG_PRODUCT_REQUEST_REPOSITORY, useClass: TypeOrmCatalogProductRequestRepository },
    CreateCatalogProductUseCase,
    UpdateCatalogProductUseCase,
    ListCatalogProductsUseCase,
    GetCatalogProductByIdUseCase,
    SetCatalogProductActiveUseCase,
    ReorderCatalogProductsUseCase,
    SetCatalogProductImageUseCase,
    RemoveCatalogProductImageUseCase,
    ListPublishedCatalogProductsUseCase,
    GetPublishedCatalogProductByIdUseCase,
    GetCatalogProductImageUseCase,
    CreateCatalogProductRequestUseCase,
    LikeCatalogProductUseCase,
    ListCatalogProductRequestsUseCase,
    GetCatalogProductRequestByIdUseCase,
    UpdateCatalogProductRequestStatusUseCase,
  ],
})
export class ProductCatalogModule {}

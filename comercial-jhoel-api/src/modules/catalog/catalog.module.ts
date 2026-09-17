import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySettingsModule } from '../company-settings/company-settings.module';
import { CatalogPhoneOrmEntity } from './infrastructure/persistence/catalog-phone.orm-entity';
import { CatalogPhoneImageOrmEntity } from './infrastructure/persistence/catalog-phone-image.orm-entity';
import { CatalogRequestOrmEntity } from './infrastructure/persistence/catalog-request.orm-entity';
import { TypeOrmCatalogPhoneRepository } from './infrastructure/persistence/typeorm-catalog-phone.repository';
import { TypeOrmCatalogRequestRepository } from './infrastructure/persistence/typeorm-catalog-request.repository';
import { CATALOG_PHONE_REPOSITORY } from './domain/repositories/catalog-phone.repository';
import { CATALOG_REQUEST_REPOSITORY } from './domain/repositories/catalog-request.repository';
import { CreateCatalogPhoneUseCase } from './application/use-cases/create-catalog-phone.use-case';
import { UpdateCatalogPhoneUseCase } from './application/use-cases/update-catalog-phone.use-case';
import { ListCatalogPhonesUseCase } from './application/use-cases/list-catalog-phones.use-case';
import { GetCatalogPhoneByIdUseCase } from './application/use-cases/get-catalog-phone-by-id.use-case';
import { ActivateCatalogPhoneUseCase } from './application/use-cases/activate-catalog-phone.use-case';
import { DeactivateCatalogPhoneUseCase } from './application/use-cases/deactivate-catalog-phone.use-case';
import { PublishCatalogPhoneUseCase } from './application/use-cases/publish-catalog-phone.use-case';
import { UnpublishCatalogPhoneUseCase } from './application/use-cases/unpublish-catalog-phone.use-case';
import { ReorderCatalogPhonesUseCase } from './application/use-cases/reorder-catalog-phones.use-case';
import { AddCatalogPhoneImageUseCase } from './application/use-cases/add-catalog-phone-image.use-case';
import { RemoveCatalogPhoneImageUseCase } from './application/use-cases/remove-catalog-phone-image.use-case';
import { SetPrimaryCatalogPhoneImageUseCase } from './application/use-cases/set-primary-catalog-phone-image.use-case';
import { ListCatalogRequestsUseCase } from './application/use-cases/list-catalog-requests.use-case';
import { GetCatalogRequestByIdUseCase } from './application/use-cases/get-catalog-request-by-id.use-case';
import { UpdateCatalogRequestStatusUseCase } from './application/use-cases/update-catalog-request-status.use-case';
import { ListPublishedCatalogPhonesUseCase } from './application/use-cases/list-published-catalog-phones.use-case';
import { GetPublishedCatalogPhoneByIdUseCase } from './application/use-cases/get-published-catalog-phone-by-id.use-case';
import { GetCatalogPhoneImageUseCase } from './application/use-cases/get-catalog-phone-image.use-case';
import { CreateCatalogRequestUseCase } from './application/use-cases/create-catalog-request.use-case';
import { CatalogPhonesController } from './presentation/controllers/catalog-phones.controller';
import { CatalogRequestsController } from './presentation/controllers/catalog-requests.controller';
import { PublicCatalogController } from './presentation/controllers/public-catalog.controller';

/** "Catálogo de Teléfonos" — fully independent from `PhonesModule` (see this module's own doc comments), imports only `CompanySettingsModule` (for `krediyaMinAmount`, the single source of truth for the Krediya credit threshold). */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatalogPhoneOrmEntity,
      CatalogPhoneImageOrmEntity,
      CatalogRequestOrmEntity,
    ]),
    CompanySettingsModule,
  ],
  controllers: [
    CatalogPhonesController,
    CatalogRequestsController,
    PublicCatalogController,
  ],
  providers: [
    {
      provide: CATALOG_PHONE_REPOSITORY,
      useClass: TypeOrmCatalogPhoneRepository,
    },
    {
      provide: CATALOG_REQUEST_REPOSITORY,
      useClass: TypeOrmCatalogRequestRepository,
    },
    CreateCatalogPhoneUseCase,
    UpdateCatalogPhoneUseCase,
    ListCatalogPhonesUseCase,
    GetCatalogPhoneByIdUseCase,
    ActivateCatalogPhoneUseCase,
    DeactivateCatalogPhoneUseCase,
    PublishCatalogPhoneUseCase,
    UnpublishCatalogPhoneUseCase,
    ReorderCatalogPhonesUseCase,
    AddCatalogPhoneImageUseCase,
    RemoveCatalogPhoneImageUseCase,
    SetPrimaryCatalogPhoneImageUseCase,
    ListCatalogRequestsUseCase,
    GetCatalogRequestByIdUseCase,
    UpdateCatalogRequestStatusUseCase,
    ListPublishedCatalogPhonesUseCase,
    GetPublishedCatalogPhoneByIdUseCase,
    GetCatalogPhoneImageUseCase,
    CreateCatalogRequestUseCase,
  ],
  // Exported so AlertsModule can count NUEVA requests for the "Nuevas solicitudes del catálogo" bell alert, without duplicating this repository.
  exports: [CATALOG_REQUEST_REPOSITORY],
})
export class CatalogModule {}

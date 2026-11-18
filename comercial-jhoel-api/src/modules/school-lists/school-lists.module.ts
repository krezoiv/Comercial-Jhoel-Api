import { Module } from '@nestjs/common';
import { CompanySettingsModule } from '../company-settings/company-settings.module';
import { SCHOOL_LIST_REPOSITORY } from './domain/repositories/school-list.repository';
import { TypeOrmSchoolListRepository } from './infrastructure/persistence/typeorm-school-list.repository';
import {
  CancelSchoolQuotationUseCase,
  ChangeSchoolQuotationStatusUseCase,
  CreateSchoolQuotationUseCase,
  DuplicateSchoolTemplateUseCase,
  GetSchoolListDashboardUseCase,
  GetSchoolListPermissionsUseCase,
  GetSchoolQuotationPdfUseCase,
  GetSchoolQuotationUseCase,
  GetSchoolReceiptPdfUseCase,
  GetSchoolBodegaStockUseCase,
  GetSchoolTemplateUseCase,
  ListSchoolQuotationsUseCase,
  ListSchoolTemplatesUseCase,
  RegisterSchoolPaymentUseCase,
  SaveSchoolTemplateUseCase,
  SetSchoolTemplateActiveUseCase,
  UpdateSchoolQuotationObservationsUseCase,
  UpdateSchoolQuotationUseCase,
  VoidSchoolPaymentUseCase,
} from './application/use-cases/school-list.use-cases';
import {
  ListSupplyProductsUseCase,
  ListSupplyProductListsUseCase,
  ListSupplyPurchasesUseCase,
  GetSupplySettingsUseCase,
  SetSupplySettingsUseCase,
  RunSupplyFifoUseCase,
  AllocateSupplyPurchaseUseCase,
  AllocateSupplyManualUseCase,
  DispatchSchoolQuotationUseCase,
} from './application/use-cases/school-supply.use-cases';
import { SchoolListsController } from './presentation/controllers/school-lists.controller';

/**
 * Listas Escolares (migration 1760007900000). Independent of Cotizaciones,
 * Ventas and inventory: it never writes products, stock, sales or cash boxes.
 */
@Module({
  imports: [CompanySettingsModule],
  controllers: [SchoolListsController],
  providers: [
    { provide: SCHOOL_LIST_REPOSITORY, useClass: TypeOrmSchoolListRepository },
    GetSchoolListPermissionsUseCase,
    ListSchoolTemplatesUseCase,
    GetSchoolTemplateUseCase,
    SaveSchoolTemplateUseCase,
    SetSchoolTemplateActiveUseCase,
    DuplicateSchoolTemplateUseCase,
    ListSchoolQuotationsUseCase,
    GetSchoolQuotationUseCase,
    CreateSchoolQuotationUseCase,
    UpdateSchoolQuotationUseCase,
    UpdateSchoolQuotationObservationsUseCase,
    ChangeSchoolQuotationStatusUseCase,
    CancelSchoolQuotationUseCase,
    RegisterSchoolPaymentUseCase,
    VoidSchoolPaymentUseCase,
    GetSchoolListDashboardUseCase,
    GetSchoolQuotationPdfUseCase,
    GetSchoolReceiptPdfUseCase,
    GetSchoolBodegaStockUseCase,
    ListSupplyProductsUseCase,
    ListSupplyProductListsUseCase,
    ListSupplyPurchasesUseCase,
    GetSupplySettingsUseCase,
    SetSupplySettingsUseCase,
    RunSupplyFifoUseCase,
    AllocateSupplyPurchaseUseCase,
    AllocateSupplyManualUseCase,
    DispatchSchoolQuotationUseCase,
  ],
})
export class SchoolListsModule {}

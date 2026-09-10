import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrmEntity } from './infrastructure/persistence/purchase.orm-entity';
import { PurchaseDetailOrmEntity } from './infrastructure/persistence/purchase-detail.orm-entity';
import { TypeOrmPurchaseRepository } from './infrastructure/persistence/typeorm-purchase.repository';
import { PURCHASE_REPOSITORY } from './domain/repositories/purchase.repository';
import { CreatePurchaseUseCase } from './application/use-cases/create-purchase.use-case';
import { ListPurchasesUseCase } from './application/use-cases/list-purchases.use-case';
import { GetPurchaseByIdUseCase } from './application/use-cases/get-purchase-by-id.use-case';
import { MarkPurchaseAsPaidUseCase } from './application/use-cases/mark-purchase-as-paid.use-case';
import { GetPurchasePdfUseCase } from './application/use-cases/get-purchase-pdf.use-case';
import { VoidPurchaseUseCase } from './application/use-cases/void-purchase.use-case';
import { PurchasesController } from './presentation/controllers/purchases.controller';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { CompanySettingsModule } from '../company-settings/company-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrmEntity, PurchaseDetailOrmEntity]),
    SuppliersModule,
    CompanySettingsModule,
  ],
  controllers: [PurchasesController],
  providers: [
    { provide: PURCHASE_REPOSITORY, useClass: TypeOrmPurchaseRepository },
    CreatePurchaseUseCase,
    ListPurchasesUseCase,
    GetPurchaseByIdUseCase,
    MarkPurchaseAsPaidUseCase,
    GetPurchasePdfUseCase,
    VoidPurchaseUseCase,
  ],
  // Exported for ReportsModule's `GetPurchaseReportDetailUseCase` — same
  // reuse-over-duplicate reasoning as `SalesModule`.
  exports: [PURCHASE_REPOSITORY],
})
export class PurchasesModule {}

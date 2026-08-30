import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrmEntity } from './infrastructure/persistence/purchase.orm-entity';
import { PurchaseDetailOrmEntity } from './infrastructure/persistence/purchase-detail.orm-entity';
import { TypeOrmPurchaseRepository } from './infrastructure/persistence/typeorm-purchase.repository';
import { PURCHASE_REPOSITORY } from './domain/repositories/purchase.repository';
import { CreatePurchaseUseCase } from './application/use-cases/create-purchase.use-case';
import { ListPurchasesUseCase } from './application/use-cases/list-purchases.use-case';
import { GetPurchaseByIdUseCase } from './application/use-cases/get-purchase-by-id.use-case';
import { PurchasesController } from './presentation/controllers/purchases.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrmEntity, PurchaseDetailOrmEntity]),
  ],
  controllers: [PurchasesController],
  providers: [
    { provide: PURCHASE_REPOSITORY, useClass: TypeOrmPurchaseRepository },
    CreatePurchaseUseCase,
    ListPurchasesUseCase,
    GetPurchaseByIdUseCase,
  ],
  // Exported for ReportsModule's `GetPurchaseReportDetailUseCase` — same
  // reuse-over-duplicate reasoning as `SalesModule`.
  exports: [PURCHASE_REPOSITORY],
})
export class PurchasesModule {}

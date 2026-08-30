import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleOrmEntity } from './infrastructure/persistence/sale.orm-entity';
import { SaleDetailOrmEntity } from './infrastructure/persistence/sale-detail.orm-entity';
import { TypeOrmSaleRepository } from './infrastructure/persistence/typeorm-sale.repository';
import { SALE_REPOSITORY } from './domain/repositories/sale.repository';
import { CreateSaleUseCase } from './application/use-cases/create-sale.use-case';
import { ListSalesUseCase } from './application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from './application/use-cases/get-sale-by-id.use-case';
import { AdjustSaleItemUseCase } from './application/use-cases/adjust-sale-item.use-case';
import { GetOpenSaleUseCase } from './application/use-cases/get-open-sale.use-case';
import { ConfirmOpenSaleUseCase } from './application/use-cases/confirm-open-sale.use-case';
import { CancelOpenSaleUseCase } from './application/use-cases/cancel-open-sale.use-case';
import { SalesController } from './presentation/controllers/sales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity])],
  controllers: [SalesController],
  providers: [
    { provide: SALE_REPOSITORY, useClass: TypeOrmSaleRepository },
    CreateSaleUseCase,
    ListSalesUseCase,
    GetSaleByIdUseCase,
    AdjustSaleItemUseCase,
    GetOpenSaleUseCase,
    ConfirmOpenSaleUseCase,
    CancelOpenSaleUseCase,
  ],
  // Exported for ReportsModule's `GetSaleReportDetailUseCase`, which reuses
  // `findById` instead of re-querying the same sale a second time.
  exports: [SALE_REPOSITORY],
})
export class SalesModule {}

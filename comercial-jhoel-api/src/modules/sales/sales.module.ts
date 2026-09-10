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
import { GetOpenSalesUseCase } from './application/use-cases/get-open-sales.use-case';
import { ConfirmOpenSaleUseCase } from './application/use-cases/confirm-open-sale.use-case';
import { CancelOpenSaleUseCase } from './application/use-cases/cancel-open-sale.use-case';
import { ConfigureSalePricingUseCase } from './application/use-cases/configure-sale-pricing.use-case';
import { GetSalePdfUseCase } from './application/use-cases/get-sale-pdf.use-case';
import { VoidSaleUseCase } from './application/use-cases/void-sale.use-case';
import { SalesController } from './presentation/controllers/sales.controller';
import { ClientsModule } from '../clients/clients.module';
import { CompanySettingsModule } from '../company-settings/company-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleOrmEntity, SaleDetailOrmEntity]),
    ClientsModule,
    CompanySettingsModule,
  ],
  controllers: [SalesController],
  providers: [
    { provide: SALE_REPOSITORY, useClass: TypeOrmSaleRepository },
    CreateSaleUseCase,
    ListSalesUseCase,
    GetSaleByIdUseCase,
    AdjustSaleItemUseCase,
    GetOpenSalesUseCase,
    ConfirmOpenSaleUseCase,
    CancelOpenSaleUseCase,
    ConfigureSalePricingUseCase,
    GetSalePdfUseCase,
    VoidSaleUseCase,
  ],
  // Exported for ReportsModule's `GetSaleReportDetailUseCase`, which reuses
  // `findById` instead of re-querying the same sale a second time.
  exports: [SALE_REPOSITORY],
})
export class SalesModule {}

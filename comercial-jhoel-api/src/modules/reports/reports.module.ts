import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleOrmEntity } from '../sales/infrastructure/persistence/sale.orm-entity';
import { SaleDetailOrmEntity } from '../sales/infrastructure/persistence/sale-detail.orm-entity';
import { PurchaseOrmEntity } from '../purchases/infrastructure/persistence/purchase.orm-entity';
import { PurchaseDetailOrmEntity } from '../purchases/infrastructure/persistence/purchase-detail.orm-entity';
import { SalesModule } from '../sales/sales.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { CategoriesModule } from '../categories/categories.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { RechargesModule } from '../recharges/recharges.module';
import { IceCreamsModule } from '../ice-creams/ice-creams.module';
import { ClientsModule } from '../clients/clients.module';
import { AccountsReceivableModule } from '../accounts-receivable/accounts-receivable.module';
import { AssetsModule } from '../assets/assets.module';
import { IceCreamSaleDetailOrmEntity } from '../ice-creams/infrastructure/persistence/ice-cream-sale-detail.orm-entity';
import { IceCreamPurchaseDetailOrmEntity } from '../ice-creams/infrastructure/persistence/ice-cream-purchase-detail.orm-entity';
import { SALES_REPORT_REPOSITORY } from './domain/repositories/sales-report.repository';
import { PURCHASES_REPORT_REPOSITORY } from './domain/repositories/purchases-report.repository';
import { ICE_CREAM_SALES_REPORT_REPOSITORY } from './domain/repositories/ice-cream-sales-report.repository';
import { ICE_CREAM_PURCHASES_REPORT_REPOSITORY } from './domain/repositories/ice-cream-purchases-report.repository';
import { TypeOrmSalesReportRepository } from './infrastructure/persistence/typeorm-sales-report.repository';
import { TypeOrmPurchasesReportRepository } from './infrastructure/persistence/typeorm-purchases-report.repository';
import { TypeOrmIceCreamSalesReportRepository } from './infrastructure/persistence/typeorm-ice-cream-sales-report.repository';
import { TypeOrmIceCreamPurchasesReportRepository } from './infrastructure/persistence/typeorm-ice-cream-purchases-report.repository';
import { GetSalesReportUseCase } from './application/use-cases/get-sales-report.use-case';
import { GetSalesReportSummaryUseCase } from './application/use-cases/get-sales-report-summary.use-case';
import { GetSalesByProductReportUseCase } from './application/use-cases/get-sales-by-product-report.use-case';
import { GetSaleReportDetailUseCase } from './application/use-cases/get-sale-report-detail.use-case';
import { ExportSalesReportPdfUseCase } from './application/use-cases/export-sales-report-pdf.use-case';
import { GetPurchasesReportUseCase } from './application/use-cases/get-purchases-report.use-case';
import { GetPurchasesReportSummaryUseCase } from './application/use-cases/get-purchases-report-summary.use-case';
import { GetPurchasesByProductReportUseCase } from './application/use-cases/get-purchases-by-product-report.use-case';
import { GetPurchaseReportDetailUseCase } from './application/use-cases/get-purchase-report-detail.use-case';
import { ExportPurchasesReportPdfUseCase } from './application/use-cases/export-purchases-report-pdf.use-case';
import { GetRechargesReportSummaryUseCase } from './application/use-cases/get-recharges-report-summary.use-case';
import { ExportRechargesReportPdfUseCase } from './application/use-cases/export-recharges-report-pdf.use-case';
import { GetIceCreamSalesReportUseCase } from './application/use-cases/get-ice-cream-sales-report.use-case';
import { GetIceCreamSalesReportSummaryUseCase } from './application/use-cases/get-ice-cream-sales-report-summary.use-case';
import { GetIceCreamPurchasesReportUseCase } from './application/use-cases/get-ice-cream-purchases-report.use-case';
import { GetIceCreamPurchasesReportSummaryUseCase } from './application/use-cases/get-ice-cream-purchases-report-summary.use-case';
import { GetIceCreamReportUseCase } from './application/use-cases/get-ice-cream-report.use-case';
import { GetIceCreamReportSummaryUseCase } from './application/use-cases/get-ice-cream-report-summary.use-case';
import { ExportIceCreamReportPdfUseCase } from './application/use-cases/export-ice-cream-report-pdf.use-case';
import { GetAccountsReceivableReportSummaryUseCase } from './application/use-cases/get-accounts-receivable-report-summary.use-case';
import { GetAssetsReportSummaryUseCase } from './application/use-cases/get-assets-report-summary.use-case';
import { GetAssetsReceivablesReportUseCase } from './application/use-cases/get-assets-receivables-report.use-case';
import { GetAssetsReceivablesReportSummaryUseCase } from './application/use-cases/get-assets-receivables-report-summary.use-case';
import { ExportAssetsReceivablesReportPdfUseCase } from './application/use-cases/export-assets-receivables-report-pdf.use-case';
import { SalesReportController } from './presentation/controllers/sales-report.controller';
import { PurchasesReportController } from './presentation/controllers/purchases-report.controller';
import { RechargesReportController } from './presentation/controllers/recharges-report.controller';
import { AssetsReceivablesReportController } from './presentation/controllers/assets-receivables-report.controller';
import { IceCreamReportController } from './presentation/controllers/ice-cream-report.controller';

/**
 * Reportería is a pure read-side, cross-cutting module — it never writes to
 * `sales`/`purchases`/`products`/etc., only queries them, so it registers
 * their ORM entities directly via its own `TypeOrmModule.forFeature(...)`
 * (safe: `autoLoadEntities: true` + the same entity class registered in two
 * modules' `forFeature` is a normal, supported TypeORM/Nest pattern — each
 * module just gets its own injection-scoped `Repository<T>`) rather than
 * importing the full `SalesModule`/`PurchasesModule` for that part. It does
 * still import `SalesModule`/`PurchasesModule` for one thing each — reusing
 * their already-correct `SALE_REPOSITORY`/`PURCHASE_REPOSITORY.findById` for
 * the `:id` detail routes, instead of duplicating that query — and
 * `CategoriesModule`/`BusinessesModule`/`ProductsModule`/`UsersModule`/`SuppliersModule` to
 * resolve filter ids into display names for the PDF export.
 *
 * `AssetsReceivablesReportController`/`IceCreamReportController` are the
 * two unified reports this ticket introduced, each replacing a pair of
 * former standalone controllers (`AccountsReceivableReportController`/
 * `AssetsReportController`, and `IceCreamSalesReportController`/
 * `IceCreamPurchasesReportController` — all four deleted). Their own
 * per-type list/summary use cases (`ListAccountsReceivableUseCase`/
 * `ListAssetsUseCase`/`GetAccountsReceivableReportSummaryUseCase`/
 * `GetAssetsReportSummaryUseCase`/`GetIceCreamSalesReportUseCase`/
 * `GetIceCreamPurchasesReportUseCase`/their own summary use cases) are kept
 * and reused directly by the new unified use cases — nothing about how
 * either table is queried or aggregated changed, only how the two are
 * orchestrated together behind one checkbox-driven endpoint.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleOrmEntity,
      SaleDetailOrmEntity,
      PurchaseOrmEntity,
      PurchaseDetailOrmEntity,
      IceCreamSaleDetailOrmEntity,
      IceCreamPurchaseDetailOrmEntity,
    ]),
    SalesModule,
    PurchasesModule,
    CategoriesModule,
    BusinessesModule,
    ProductsModule,
    UsersModule,
    SuppliersModule,
    RechargesModule,
    IceCreamsModule,
    ClientsModule,
    AccountsReceivableModule,
    AssetsModule,
  ],
  controllers: [
    SalesReportController,
    PurchasesReportController,
    RechargesReportController,
    AssetsReceivablesReportController,
    IceCreamReportController,
  ],
  providers: [
    {
      provide: SALES_REPORT_REPOSITORY,
      useClass: TypeOrmSalesReportRepository,
    },
    {
      provide: PURCHASES_REPORT_REPOSITORY,
      useClass: TypeOrmPurchasesReportRepository,
    },
    {
      provide: ICE_CREAM_SALES_REPORT_REPOSITORY,
      useClass: TypeOrmIceCreamSalesReportRepository,
    },
    {
      provide: ICE_CREAM_PURCHASES_REPORT_REPOSITORY,
      useClass: TypeOrmIceCreamPurchasesReportRepository,
    },
    GetSalesReportUseCase,
    GetSalesReportSummaryUseCase,
    GetSalesByProductReportUseCase,
    GetSaleReportDetailUseCase,
    ExportSalesReportPdfUseCase,
    GetPurchasesReportUseCase,
    GetPurchasesReportSummaryUseCase,
    GetPurchasesByProductReportUseCase,
    GetPurchaseReportDetailUseCase,
    ExportPurchasesReportPdfUseCase,
    GetRechargesReportSummaryUseCase,
    ExportRechargesReportPdfUseCase,
    GetIceCreamSalesReportUseCase,
    GetIceCreamSalesReportSummaryUseCase,
    GetIceCreamPurchasesReportUseCase,
    GetIceCreamPurchasesReportSummaryUseCase,
    GetIceCreamReportUseCase,
    GetIceCreamReportSummaryUseCase,
    ExportIceCreamReportPdfUseCase,
    GetAccountsReceivableReportSummaryUseCase,
    GetAssetsReportSummaryUseCase,
    GetAssetsReceivablesReportUseCase,
    GetAssetsReceivablesReportSummaryUseCase,
    ExportAssetsReceivablesReportPdfUseCase,
  ],
})
export class ReportsModule {}

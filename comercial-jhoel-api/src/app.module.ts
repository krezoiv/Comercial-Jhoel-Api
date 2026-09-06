import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PresentationTypesModule } from './modules/presentation-types/presentation-types.module';
import { UnitsOfMeasureModule } from './modules/units-of-measure/units-of-measure.module';
import { SalesModule } from './modules/sales/sales.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RechargesModule } from './modules/recharges/recharges.module';
import { IceCreamsModule } from './modules/ice-creams/ice-creams.module';
import { AccountTypesModule } from './modules/account-types/account-types.module';
import { BanksModule } from './modules/banks/banks.module';
import { TransactionBanksModule } from './modules/transaction-banks/transaction-banks.module';
import { TransactionTypesModule } from './modules/transaction-types/transaction-types.module';
import { BankDepositsModule } from './modules/bank-deposits/bank-deposits.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AccountsReceivableModule } from './modules/accounts-receivable/accounts-receivable.module';
import { AssetsModule } from './modules/assets/assets.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AlertSettingsModule } from './modules/alert-settings/alert-settings.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { CompanySettingsModule } from './modules/company-settings/company-settings.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { KeyboardShortcutsModule } from './modules/keyboard-shortcuts/keyboard-shortcuts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        // Always false, on purpose: every schema change goes through an
        // explicit migration under `src/database/migrations/`. Letting
        // TypeORM auto-sync the schema from entity metadata would risk
        // silently altering or dropping real production data the moment an
        // entity file changes — migrations are reviewable and reversible,
        // auto-sync is neither.
        synchronize: false,
      }),
    }),
    HealthModule,
    RolesModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    BusinessesModule,
    PresentationTypesModule,
    UnitsOfMeasureModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    SuppliersModule,
    PurchasesModule,
    IceCreamsModule,
    AccountTypesModule,
    BanksModule,
    TransactionBanksModule,
    TransactionTypesModule,
    BankDepositsModule,
    ClientsModule,
    AccountsReceivableModule,
    AssetsModule,
    ReportsModule,
    RechargesModule,
    DashboardModule,
    AlertSettingsModule,
    AlertsModule,
    CompanySettingsModule,
    TicketsModule,
    QuotationsModule,
    KeyboardShortcutsModule,
  ],
  providers: [
    // Registered globally here (not per-controller) — see each class's own
    // doc comment for the exact response/error shapes they produce.
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}

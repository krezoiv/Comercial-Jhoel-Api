import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationOrmEntity } from './infrastructure/persistence/quotation.orm-entity';
import { QuotationDetailOrmEntity } from './infrastructure/persistence/quotation-detail.orm-entity';
import { TypeOrmQuotationRepository } from './infrastructure/persistence/typeorm-quotation.repository';
import { QUOTATION_REPOSITORY } from './domain/repositories/quotation.repository';
import { CreateQuotationUseCase } from './application/use-cases/create-quotation.use-case';
import { ListQuotationsUseCase } from './application/use-cases/list-quotations.use-case';
import { GetQuotationByIdUseCase } from './application/use-cases/get-quotation-by-id.use-case';
import { VoidQuotationUseCase } from './application/use-cases/void-quotation.use-case';
import { GetQuotationPdfUseCase } from './application/use-cases/get-quotation-pdf.use-case';
import { QuotationsController } from './presentation/controllers/quotations.controller';
import { ClientsModule } from '../clients/clients.module';
import { CompanySettingsModule } from '../company-settings/company-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuotationOrmEntity, QuotationDetailOrmEntity]),
    ClientsModule,
    CompanySettingsModule,
  ],
  controllers: [QuotationsController],
  providers: [
    { provide: QUOTATION_REPOSITORY, useClass: TypeOrmQuotationRepository },
    CreateQuotationUseCase,
    ListQuotationsUseCase,
    GetQuotationByIdUseCase,
    VoidQuotationUseCase,
    GetQuotationPdfUseCase,
  ],
})
export class QuotationsModule {}

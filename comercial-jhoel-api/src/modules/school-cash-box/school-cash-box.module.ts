import { Module } from '@nestjs/common';
import { CompanySettingsModule } from '../company-settings/company-settings.module';
import { SCHOOL_CASH_BOX_REPOSITORY } from './domain/repositories/school-cash-box.repository';
import { TypeOrmSchoolCashBoxRepository } from './infrastructure/persistence/typeorm-school-cash-box.repository';
import {
  ExportSchoolCashReportUseCase,
  ExportSchoolCustomerStatementUseCase,
  GetSchoolCustomerUseCase,
  ListSchoolCustomersUseCase,
  ListSchoolPaymentsUseCase,
  GetSchoolCashCountUseCase,
  GetSchoolCashMovementUseCase,
  GetSchoolCashReportUseCase,
  GetSchoolCashSummaryUseCase,
  GetSchoolCashTransferUseCase,
  ListSchoolCashCountsUseCase,
  ListSchoolCashExitsUseCase,
  ListSchoolCashMovementsUseCase,
  ListSchoolCashReceiptsUseCase,
  ListSchoolCashReportsUseCase,
  ListSchoolCashTransfersUseCase,
  ListSchoolCashUsersUseCase,
  RegisterSchoolCashAdjustmentUseCase,
  RegisterSchoolCashCountUseCase,
  RegisterSchoolCashExitUseCase,
  RegisterSchoolCashTransferUseCase,
  VoidSchoolCashAdjustmentUseCase,
  VoidSchoolCashExitUseCase,
  VoidSchoolCashTransferUseCase,
} from './application/use-cases/school-cash-box.use-cases';
import { SchoolCashBoxController } from './presentation/controllers/school-cash-box.controller';

/**
 * Caja de Listas Escolares (migration 1760008700000): the independent cash box
 * of school-list payments. List payments reach it automatically through the
 * payment trigger; this module reads it and runs its own operations
 * (transfers from banks, exits, adjustments, cash counts, reports). It exports
 * its repository so the agents' cuadre can read "listas por trasladar".
 */
@Module({
  imports: [CompanySettingsModule],
  controllers: [SchoolCashBoxController],
  providers: [
    {
      provide: SCHOOL_CASH_BOX_REPOSITORY,
      useClass: TypeOrmSchoolCashBoxRepository,
    },
    GetSchoolCashSummaryUseCase,
    ListSchoolCashMovementsUseCase,
    GetSchoolCashMovementUseCase,
    ListSchoolCashReceiptsUseCase,
    ListSchoolCashTransfersUseCase,
    GetSchoolCashTransferUseCase,
    RegisterSchoolCashTransferUseCase,
    VoidSchoolCashTransferUseCase,
    ListSchoolCashExitsUseCase,
    RegisterSchoolCashExitUseCase,
    VoidSchoolCashExitUseCase,
    RegisterSchoolCashAdjustmentUseCase,
    VoidSchoolCashAdjustmentUseCase,
    ListSchoolCashCountsUseCase,
    GetSchoolCashCountUseCase,
    RegisterSchoolCashCountUseCase,
    ListSchoolCashUsersUseCase,
    ListSchoolCashReportsUseCase,
    GetSchoolCashReportUseCase,
    ExportSchoolCashReportUseCase,
    ListSchoolCustomersUseCase,
    GetSchoolCustomerUseCase,
    ExportSchoolCustomerStatementUseCase,
    ListSchoolPaymentsUseCase,
  ],
  exports: [SCHOOL_CASH_BOX_REPOSITORY],
})
export class SchoolCashBoxModule {}

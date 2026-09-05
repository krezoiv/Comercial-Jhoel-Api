import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListBankDepositOperationsUseCase } from '../../../bank-deposits/application/use-cases/list-bank-deposit-operations.use-case';
import { GetBankDepositsReportSummaryUseCase } from '../../application/use-cases/get-bank-deposits-report-summary.use-case';
import { ExportBankDepositsReportPdfUseCase } from '../../application/use-cases/export-bank-deposits-report-pdf.use-case';
import { BankDepositsReportFilterQueryDto } from '../dtos/bank-deposits-report-filter.query.dto';

/**
 * Reportería is a management view, not an operational one — same rule as
 * `RechargesReportController`/`SalesReportController`: every route here is
 * `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `BankDepositsController` itself,
 * which deliberately leaves registering a deposit open to any authenticated
 * account.
 *
 * `findAll` delegates straight to `ListBankDepositOperationsUseCase`
 * (imported via `BankDepositsModule`) instead of a second, near-identical
 * list use case living in this module — identical date-range validation
 * and pagination, no reason to duplicate it.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/bank-deposits')
export class BankDepositsReportController {
  constructor(
    private readonly listBankDepositOperationsUseCase: ListBankDepositOperationsUseCase,
    private readonly getBankDepositsReportSummaryUseCase: GetBankDepositsReportSummaryUseCase,
    private readonly exportBankDepositsReportPdfUseCase: ExportBankDepositsReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: BankDepositsReportFilterQueryDto) {
    return this.listBankDepositOperationsUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: BankDepositsReportFilterQueryDto) {
    return this.getBankDepositsReportSummaryUseCase.execute(query);
  }

  /**
   * Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent
   * directly via `res.send()` instead of passing through the global
   * `ResponseInterceptor`, which would otherwise wrap it as
   * `{ success, data }` JSON and corrupt the binary response.
   */
  @Get('export')
  async export(
    @Query() query: BankDepositsReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportBankDepositsReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-transacciones-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

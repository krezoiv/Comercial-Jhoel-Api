import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import {
  GetBankTransfersReportSummaryUseCase,
  GetBankTransfersReportUseCase,
} from '../../application/use-cases/get-bank-transfers-report.use-case';
import { ExportBankTransfersReportPdfUseCase } from '../../application/use-cases/export-bank-transfers-report-pdf.use-case';
import { BankTransfersReportFilterQueryDto } from '../dtos/bank-transfers-report-filter.query.dto';

/** Reporte de Transferencias Bancarias — admin-only, igual que toda la Reportería. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/bank-transfers')
export class BankTransfersReportController {
  constructor(
    private readonly getBankTransfersReportUseCase: GetBankTransfersReportUseCase,
    private readonly getBankTransfersReportSummaryUseCase: GetBankTransfersReportSummaryUseCase,
    private readonly exportBankTransfersReportPdfUseCase: ExportBankTransfersReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: BankTransfersReportFilterQueryDto) {
    return this.getBankTransfersReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: BankTransfersReportFilterQueryDto) {
    return this.getBankTransfersReportSummaryUseCase.execute(query);
  }

  /** `@Res()` para enviar el PDF sin pasar por `ResponseInterceptor`, igual que los demás exports. */
  @Get('export')
  async export(
    @Query() query: BankTransfersReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportBankTransfersReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-transferencias-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

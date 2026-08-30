import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetAssetsReceivablesReportUseCase } from '../../application/use-cases/get-assets-receivables-report.use-case';
import { GetAssetsReceivablesReportSummaryUseCase } from '../../application/use-cases/get-assets-receivables-report-summary.use-case';
import { ExportAssetsReceivablesReportPdfUseCase } from '../../application/use-cases/export-assets-receivables-report-pdf.use-case';
import { AssetsReceivablesReportFilterQueryDto } from '../dtos/assets-receivables-report-filter.query.dto';

function buildExportFilename(startDate?: string, endDate?: string): string {
  if (startDate && endDate) {
    return `reporte-activos-cuentas-por-cobrar-${startDate}-al-${endDate}.pdf`;
  }
  const today = new Date().toISOString().slice(0, 10);
  return `reporte-activos-cuentas-por-cobrar-${today}.pdf`;
}

/**
 * Replaces the two former standalone controllers
 * (`AccountsReceivableReportController`/`AssetsReportController`, both
 * removed) with a single unified one — the checkbox-selected `types` query
 * param decides whether one or both tables are queried, per the ticket's
 * explicit consolidation requirement. Same admin-only policy as every
 * other report controller in this module.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/assets-receivables')
export class AssetsReceivablesReportController {
  constructor(
    private readonly getAssetsReceivablesReportUseCase: GetAssetsReceivablesReportUseCase,
    private readonly getAssetsReceivablesReportSummaryUseCase: GetAssetsReceivablesReportSummaryUseCase,
    private readonly exportAssetsReceivablesReportPdfUseCase: ExportAssetsReceivablesReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: AssetsReceivablesReportFilterQueryDto) {
    return this.getAssetsReceivablesReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: AssetsReceivablesReportFilterQueryDto) {
    return this.getAssetsReceivablesReportSummaryUseCase.execute(query);
  }

  /** Uses `@Res()` — see `SalesReportController.export`'s doc comment for why. */
  @Get('export')
  async export(
    @Query() query: AssetsReceivablesReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportAssetsReceivablesReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${buildExportFilename(query.startDate, query.endDate)}"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

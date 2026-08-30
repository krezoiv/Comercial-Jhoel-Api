import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetIceCreamReportUseCase } from '../../application/use-cases/get-ice-cream-report.use-case';
import { GetIceCreamReportSummaryUseCase } from '../../application/use-cases/get-ice-cream-report-summary.use-case';
import { ExportIceCreamReportPdfUseCase } from '../../application/use-cases/export-ice-cream-report-pdf.use-case';
import { IceCreamReportFilterQueryDto } from '../dtos/ice-cream-report-filter.query.dto';

function buildExportFilename(startDate?: string, endDate?: string): string {
  if (startDate && endDate) {
    return `reporte-heladeria-${startDate}-al-${endDate}.pdf`;
  }
  const today = new Date().toISOString().slice(0, 10);
  return `reporte-heladeria-${today}.pdf`;
}

/**
 * Replaces the two former standalone controllers
 * (`IceCreamSalesReportController`/`IceCreamPurchasesReportController`,
 * both removed) with a single unified one — the checkbox-selected `types`
 * query param decides whether ventas, compras, or both are queried. Same
 * admin-only policy as every other report controller in this module.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/ice-cream')
export class IceCreamReportController {
  constructor(
    private readonly getIceCreamReportUseCase: GetIceCreamReportUseCase,
    private readonly getIceCreamReportSummaryUseCase: GetIceCreamReportSummaryUseCase,
    private readonly exportIceCreamReportPdfUseCase: ExportIceCreamReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: IceCreamReportFilterQueryDto) {
    return this.getIceCreamReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: IceCreamReportFilterQueryDto) {
    return this.getIceCreamReportSummaryUseCase.execute(query);
  }

  /** Uses `@Res()` — see `SalesReportController.export`'s doc comment for why. */
  @Get('export')
  async export(
    @Query() query: IceCreamReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportIceCreamReportPdfUseCase.execute({
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

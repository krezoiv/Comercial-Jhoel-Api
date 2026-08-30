import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetPurchasesReportUseCase } from '../../application/use-cases/get-purchases-report.use-case';
import { GetPurchasesReportSummaryUseCase } from '../../application/use-cases/get-purchases-report-summary.use-case';
import { GetPurchasesByProductReportUseCase } from '../../application/use-cases/get-purchases-by-product-report.use-case';
import { GetPurchaseReportDetailUseCase } from '../../application/use-cases/get-purchase-report-detail.use-case';
import { ExportPurchasesReportPdfUseCase } from '../../application/use-cases/export-purchases-report-pdf.use-case';
import { PurchasesReportFilterQueryDto } from '../dtos/purchases-report-filter.query.dto';

/** Same admin-only policy and route-ordering rule as `SalesReportController` — see that file's doc comment. */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/purchases')
export class PurchasesReportController {
  constructor(
    private readonly getPurchasesReportUseCase: GetPurchasesReportUseCase,
    private readonly getPurchasesReportSummaryUseCase: GetPurchasesReportSummaryUseCase,
    private readonly getPurchasesByProductReportUseCase: GetPurchasesByProductReportUseCase,
    private readonly getPurchaseReportDetailUseCase: GetPurchaseReportDetailUseCase,
    private readonly exportPurchasesReportPdfUseCase: ExportPurchasesReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: PurchasesReportFilterQueryDto) {
    return this.getPurchasesReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: PurchasesReportFilterQueryDto) {
    return this.getPurchasesReportSummaryUseCase.execute(query);
  }

  @Get('by-product')
  getByProduct(@Query() query: PurchasesReportFilterQueryDto) {
    return this.getPurchasesByProductReportUseCase.execute(query);
  }

  /** See `SalesReportController.export`'s doc comment — same `@Res()` reasoning. */
  @Get('export')
  async export(
    @Query() query: PurchasesReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportPurchasesReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-compras-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPurchaseReportDetailUseCase.execute(id);
  }
}

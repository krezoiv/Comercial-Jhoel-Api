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
import { GetSalesReportUseCase } from '../../application/use-cases/get-sales-report.use-case';
import { GetSalesReportSummaryUseCase } from '../../application/use-cases/get-sales-report-summary.use-case';
import { GetSalesByProductReportUseCase } from '../../application/use-cases/get-sales-by-product-report.use-case';
import { GetSaleReportDetailUseCase } from '../../application/use-cases/get-sale-report-detail.use-case';
import { ExportSalesReportPdfUseCase } from '../../application/use-cases/export-sales-report-pdf.use-case';
import { SalesReportFilterQueryDto } from '../dtos/sales-report-filter.query.dto';

/**
 * Reportería is a management view, not an operational one — every route
 * here is `@Roles('ADMIN', 'SUPER_ADMIN')` (unlike `SalesController`, which
 * deliberately leaves `POST /sales` open to any authenticated account
 * because *registering* a sale is a cashier's job). A `USER` token gets a
 * real `403`, not just a hidden sidebar entry.
 *
 * Route order matters, same lesson as `SalesController`: `summary`,
 * `by-product`, and `export` must be declared before `:id`, or Nest would
 * match them as `GET /reports/sales/:id` with `id="summary"` etc. and fail
 * `ParseUUIDPipe` instead of reaching the intended handler.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/sales')
export class SalesReportController {
  constructor(
    private readonly getSalesReportUseCase: GetSalesReportUseCase,
    private readonly getSalesReportSummaryUseCase: GetSalesReportSummaryUseCase,
    private readonly getSalesByProductReportUseCase: GetSalesByProductReportUseCase,
    private readonly getSaleReportDetailUseCase: GetSaleReportDetailUseCase,
    private readonly exportSalesReportPdfUseCase: ExportSalesReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: SalesReportFilterQueryDto) {
    return this.getSalesReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: SalesReportFilterQueryDto) {
    return this.getSalesReportSummaryUseCase.execute(query);
  }

  @Get('by-product')
  getByProduct(@Query() query: SalesReportFilterQueryDto) {
    return this.getSalesByProductReportUseCase.execute(query);
  }

  /**
   * Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent
   * directly via `res.send()` instead of passing through the global
   * `ResponseInterceptor`, which would otherwise wrap it as
   * `{ success, data }` JSON and corrupt the binary response.
   */
  @Get('export')
  async export(
    @Query() query: SalesReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportSalesReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-ventas-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getSaleReportDetailUseCase.execute(id);
  }
}

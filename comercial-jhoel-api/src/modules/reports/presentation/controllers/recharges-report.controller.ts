import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetRechargeHistoryUseCase } from '../../../recharges/application/use-cases/get-recharge-history.use-case';
import { GetRechargesReportSummaryUseCase } from '../../application/use-cases/get-recharges-report-summary.use-case';
import { ExportRechargesReportPdfUseCase } from '../../application/use-cases/export-recharges-report-pdf.use-case';
import { RechargesReportFilterQueryDto } from '../dtos/recharges-report-filter.query.dto';

/**
 * Reportería is a management view, not an operational one — same rule as
 * `SalesReportController`/`PurchasesReportController`: every route here is
 * `@Roles('ADMIN', 'SUPER_ADMIN')`, unlike `RechargesController` itself,
 * which deliberately leaves the daily register (compras, saldo final,
 * cuadre) open to any authenticated account. A `USER` token gets a real
 * `403` here, not just a hidden sidebar entry — reading the full historical
 * record across every cycle is a management concern, the daily operational
 * screen is not.
 *
 * `findAll` delegates straight to `GetRechargeHistoryUseCase` (imported via
 * `RechargesModule`) instead of a second, near-identical list use case
 * living in this module — identical date-range validation and pagination,
 * no reason to duplicate it.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/recharges')
export class RechargesReportController {
  constructor(
    private readonly getRechargeHistoryUseCase: GetRechargeHistoryUseCase,
    private readonly getRechargesReportSummaryUseCase: GetRechargesReportSummaryUseCase,
    private readonly exportRechargesReportPdfUseCase: ExportRechargesReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: RechargesReportFilterQueryDto) {
    return this.getRechargeHistoryUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: RechargesReportFilterQueryDto) {
    return this.getRechargesReportSummaryUseCase.execute(query);
  }

  /**
   * Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent
   * directly via `res.send()` instead of passing through the global
   * `ResponseInterceptor`, which would otherwise wrap it as
   * `{ success, data }` JSON and corrupt the binary response.
   */
  @Get('export')
  async export(
    @Query() query: RechargesReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportRechargesReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-recargas-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

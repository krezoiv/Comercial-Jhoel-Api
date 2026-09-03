import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetAgentReconciliationsReportUseCase } from '../../application/use-cases/get-agent-reconciliations-report.use-case';
import { GetAgentReconciliationsReportSummaryUseCase } from '../../application/use-cases/get-agent-reconciliations-report-summary.use-case';
import { ExportAgentReconciliationsReportPdfUseCase } from '../../application/use-cases/export-agent-reconciliations-report-pdf.use-case';
import { AgentReconciliationsReportFilterQueryDto } from '../dtos/agent-reconciliations-report-filter.query.dto';

/**
 * Structural clone of `RechargesReportController` — a management view, not
 * an operational one: every route here is `@Roles('ADMIN', 'SUPER_ADMIN')`,
 * unlike `AgentReconciliationsController`/`BanksController`, which leave the
 * daily cuadre operation open to any authenticated account. A `USER` token
 * gets a real `403` here, not just a hidden sidebar entry.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/agent-reconciliations')
export class AgentReconciliationsReportController {
  constructor(
    private readonly getAgentReconciliationsReportUseCase: GetAgentReconciliationsReportUseCase,
    private readonly getAgentReconciliationsReportSummaryUseCase: GetAgentReconciliationsReportSummaryUseCase,
    private readonly exportAgentReconciliationsReportPdfUseCase: ExportAgentReconciliationsReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: AgentReconciliationsReportFilterQueryDto) {
    return this.getAgentReconciliationsReportUseCase.execute(query);
  }

  @Get('summary')
  getSummary(@Query() query: AgentReconciliationsReportFilterQueryDto) {
    return this.getAgentReconciliationsReportSummaryUseCase.execute(query);
  }

  /**
   * Uses `@Res()` (not `{ passthrough: true }`) so the PDF `Buffer` is sent
   * directly, bypassing the global `ResponseInterceptor` — same reasoning as
   * every other export route in this module.
   */
  @Get('export')
  async export(
    @Query() query: AgentReconciliationsReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer =
      await this.exportAgentReconciliationsReportPdfUseCase.execute({
        ...query,
        generatedByUsername: username,
      });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-cuadre-agentes-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

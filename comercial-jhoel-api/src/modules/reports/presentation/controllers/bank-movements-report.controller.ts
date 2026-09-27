import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListBankMovementsUseCase } from '../../../banks/application/use-cases/list-bank-movements.use-case';
import { ExportBankMovementsReportPdfUseCase } from '../../application/use-cases/export-bank-movements-report-pdf.use-case';
import { BankMovementsReportFilterQueryDto } from '../dtos/bank-movements-report-filter.query.dto';

/**
 * Historial de movimientos de saldo bancario — admin-only, igual que toda
 * la Reportería. `findAll` delega en `ListBankMovementsUseCase` (exportado
 * por `BanksModule`), sin un segundo caso de uso duplicado.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('reports/bank-movements')
export class BankMovementsReportController {
  constructor(
    private readonly listBankMovementsUseCase: ListBankMovementsUseCase,
    private readonly exportBankMovementsReportPdfUseCase: ExportBankMovementsReportPdfUseCase,
  ) {}

  @Get()
  findAll(@Query() query: BankMovementsReportFilterQueryDto) {
    return this.listBankMovementsUseCase.execute(query);
  }

  /** `@Res()` para enviar el PDF sin pasar por `ResponseInterceptor` — mismo motivo que los demás exports. */
  @Get('export')
  async export(
    @Query() query: BankMovementsReportFilterQueryDto,
    @CurrentUser('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.exportBankMovementsReportPdfUseCase.execute({
      ...query,
      generatedByUsername: username,
    });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="movimientos-bancarios-${Date.now()}.pdf"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }
}

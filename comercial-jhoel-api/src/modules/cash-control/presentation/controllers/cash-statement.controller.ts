import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  ExportCashStatementUseCase,
  GetCashStatementUseCase,
  ListCashStatementDaysUseCase,
  type CashStatementActor,
} from '../../application/use-cases/cash-statement.use-cases';
import {
  CashStatementDaysQueryDto,
  CashStatementExportQueryDto,
  CashStatementQueryDto,
} from '../dtos/cash-statement.request.dto';

const actor = (user: RequestUser): CashStatementActor => ({
  userId: user.userId,
  username: user.username,
  role: user.role,
});

/**
 * Estado de Cuenta de Efectivo (`/cash-control/statement`). Read-only views of
 * the official Kardex; any authenticated account reads the movements (same as
 * the Kardex), counts / Bodega / custody need `cash_custody.view` — enforced in
 * the use cases.
 */
@UseGuards(JwtAuthGuard)
@Controller('cash-control/statement')
export class CashStatementController {
  constructor(
    private readonly getStatement: GetCashStatementUseCase,
    private readonly listDays: ListCashStatementDaysUseCase,
    private readonly exportStatement: ExportCashStatementUseCase,
  ) {}

  /** History: one line per bank day with opening, entries, exits, closing and its last count. */
  @Get('days')
  days(
    @Query() query: CashStatementDaysQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listDays.execute(actor(user), query.limit);
  }

  /** PDF or Excel of the statement with the same period and filters as the screen. */
  @Get('export')
  async export(
    @Query() query: CashStatementExportQueryDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const { format, ...filters } = query;
    const file = await this.exportStatement.execute(
      actor(user),
      filters,
      format,
    );
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Content-Length': file.buffer.length,
    });
    res.end(file.buffer);
  }

  /** The statement of a bank day (default: current) or date range, with its movements page. */
  @Get()
  statement(
    @Query() query: CashStatementQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getStatement.execute(actor(user), query);
  }
}

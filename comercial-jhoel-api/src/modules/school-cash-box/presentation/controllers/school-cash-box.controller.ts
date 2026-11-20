import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  CashActor,
  ExportSchoolCashReportUseCase,
  ExportSchoolCustomerStatementUseCase,
  GetSchoolCustomerUseCase,
  ListSchoolCustomersUseCase,
  ListSchoolPaymentsUseCase,
  GetSchoolCashCountUseCase,
  GetSchoolCashMovementUseCase,
  GetSchoolCashReportUseCase,
  GetSchoolCashSummaryUseCase,
  GetSchoolCashTransferUseCase,
  ListSchoolCashCountsUseCase,
  ListSchoolCashExitsUseCase,
  ListSchoolCashMovementsUseCase,
  ListSchoolCashReceiptsUseCase,
  ListSchoolCashReportsUseCase,
  ListSchoolCashTransfersUseCase,
  ListSchoolCashUsersUseCase,
  RegisterSchoolCashAdjustmentUseCase,
  RegisterSchoolCashCountUseCase,
  RegisterSchoolCashExitUseCase,
  RegisterSchoolCashTransferUseCase,
  VoidSchoolCashAdjustmentUseCase,
  VoidSchoolCashExitUseCase,
  VoidSchoolCashTransferUseCase,
} from '../../application/use-cases/school-cash-box.use-cases';
import {
  RegisterSchoolCashAdjustmentDto,
  RegisterSchoolCashCountDto,
  RegisterSchoolCashExitDto,
  RegisterSchoolCashTransferDto,
  SchoolCashExportQueryDto,
  SchoolCashMovementsQueryDto,
  SchoolCashRangeQueryDto,
  SchoolCashReasonDto,
  SchoolCashReceiptsQueryDto,
  SchoolCashReportQueryDto,
  SchoolCashSummaryQueryDto,
  SchoolCustomersQueryDto,
  SchoolPaymentsQueryDto,
} from '../dtos/school-cash-box.request.dto';

const actor = (user: RequestUser): CashActor => ({
  userId: user.userId,
  role: user.role,
  username: user.username,
});

const DEFAULT_LIMIT = 25;

/**
 * Caja de Listas Escolares. Every use case checks its permission
 * (`school_lists.cash.*` in `SCHOOL_LIST_PERMISSION_ROLES`) and every write is
 * one SQL function that checks it again. Static routes come before `:id` ones.
 */
@UseGuards(JwtAuthGuard)
@Controller('school-cash-box')
export class SchoolCashBoxController {
  constructor(
    private readonly summaryUseCase: GetSchoolCashSummaryUseCase,
    private readonly movementsUseCase: ListSchoolCashMovementsUseCase,
    private readonly movementUseCase: GetSchoolCashMovementUseCase,
    private readonly receiptsUseCase: ListSchoolCashReceiptsUseCase,
    private readonly transfersUseCase: ListSchoolCashTransfersUseCase,
    private readonly transferUseCase: GetSchoolCashTransferUseCase,
    private readonly registerTransferUseCase: RegisterSchoolCashTransferUseCase,
    private readonly voidTransferUseCase: VoidSchoolCashTransferUseCase,
    private readonly exitsUseCase: ListSchoolCashExitsUseCase,
    private readonly registerExitUseCase: RegisterSchoolCashExitUseCase,
    private readonly voidExitUseCase: VoidSchoolCashExitUseCase,
    private readonly registerAdjustmentUseCase: RegisterSchoolCashAdjustmentUseCase,
    private readonly voidAdjustmentUseCase: VoidSchoolCashAdjustmentUseCase,
    private readonly countsUseCase: ListSchoolCashCountsUseCase,
    private readonly countUseCase: GetSchoolCashCountUseCase,
    private readonly registerCountUseCase: RegisterSchoolCashCountUseCase,
    private readonly usersUseCase: ListSchoolCashUsersUseCase,
    private readonly reportsUseCase: ListSchoolCashReportsUseCase,
    private readonly reportUseCase: GetSchoolCashReportUseCase,
    private readonly exportUseCase: ExportSchoolCashReportUseCase,
    private readonly customersUseCase: ListSchoolCustomersUseCase,
    private readonly customerUseCase: GetSchoolCustomerUseCase,
    private readonly statementUseCase: ExportSchoolCustomerStatementUseCase,
    private readonly paymentsUseCase: ListSchoolPaymentsUseCase,
  ) {}

  @Get('summary')
  summary(
    @Query() query: SchoolCashSummaryQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.summaryUseCase.execute(actor(user), query);
  }

  /** Customers of Listas Escolares (same phone digits) with their account status. */
  @Get('customers')
  customers(
    @Query() query: SchoolCustomersQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.customersUseCase.execute(actor(user), {
      search: query.search,
      view: query.view ?? 'ALL',
      status: query.status,
      grade: query.grade,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      sort: query.sort ?? 'BALANCE',
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Get('customers/:key/statement')
  async statement(
    @Param('key') key: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.statementUseCase.execute(actor(user), key);
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Length': file.buffer.length,
    });
    res.end(file.buffer);
  }

  @Get('customers/:key')
  customer(
    @Param('key') key: string,
    @Query() query: SchoolCashReportQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.customerUseCase.execute(actor(user), key, query);
  }

  /** Every list payment (all customers) with where its money went. */
  @Get('payments')
  payments(
    @Query() query: SchoolPaymentsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.paymentsUseCase.execute(actor(user), {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Get('movements')
  movements(
    @Query() query: SchoolCashMovementsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.movementsUseCase.execute(actor(user), {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Get('movements/:id')
  movement(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.movementUseCase.execute(actor(user), id);
  }

  @Post('movements/:id/void')
  voidAdjustment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SchoolCashReasonDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidAdjustmentUseCase.execute(actor(user), id, dto.reason);
  }

  @Get('receipts')
  receipts(
    @Query() query: SchoolCashReceiptsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.receiptsUseCase.execute(actor(user), {
      bankId: query.bankId,
      scope: query.scope ?? 'OPEN',
      search: query.search,
    });
  }

  @Get('transfers')
  transfers(
    @Query() query: SchoolCashRangeQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.transfersUseCase.execute(actor(user), {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Post('transfers')
  registerTransfer(
    @Body() dto: RegisterSchoolCashTransferDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerTransferUseCase.execute(
      actor(user),
      {
        bankId: dto.bankId,
        items: dto.items,
        reference: dto.reference,
        observations: dto.observations,
      },
      dto.clientRequestId,
    );
  }

  @Get('transfers/:id')
  transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.transferUseCase.execute(actor(user), id);
  }

  @Post('transfers/:id/void')
  voidTransfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SchoolCashReasonDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidTransferUseCase.execute(actor(user), id, dto.reason);
  }

  @Get('exits')
  exits(
    @Query() query: SchoolCashRangeQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.exitsUseCase.execute(actor(user), {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Post('exits')
  registerExit(
    @Body() dto: RegisterSchoolCashExitDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { clientRequestId, ...input } = dto;
    return this.registerExitUseCase.execute(
      actor(user),
      input,
      clientRequestId,
    );
  }

  @Post('exits/:id/void')
  voidExit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SchoolCashReasonDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidExitUseCase.execute(actor(user), id, dto.reason);
  }

  @Post('adjustments')
  registerAdjustment(
    @Body() dto: RegisterSchoolCashAdjustmentDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { clientRequestId, ...input } = dto;
    return this.registerAdjustmentUseCase.execute(
      actor(user),
      input,
      clientRequestId,
    );
  }

  @Get('counts')
  counts(
    @Query() query: SchoolCashRangeQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.countsUseCase.execute(actor(user), {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? DEFAULT_LIMIT,
    });
  }

  @Post('counts')
  registerCount(
    @Body() dto: RegisterSchoolCashCountDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerCountUseCase.execute(
      actor(user),
      { details: dto.details, observations: dto.observations },
      dto.clientRequestId,
    );
  }

  @Get('counts/:id')
  count(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.countUseCase.execute(actor(user), id);
  }

  @Get('users')
  users(@CurrentUser() user: RequestUser) {
    return this.usersUseCase.execute(actor(user));
  }

  @Get('reports')
  reports(@CurrentUser() user: RequestUser) {
    return this.reportsUseCase.execute(actor(user));
  }

  @Get('reports/:kind/export')
  async export(
    @Param('kind') kind: string,
    @Query() query: SchoolCashExportQueryDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.exportUseCase.execute(
      actor(user),
      kind,
      query.format,
      query.dateFrom,
      query.dateTo,
    );
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Content-Length': file.buffer.length,
    });
    res.end(file.buffer);
  }

  @Get('reports/:kind')
  report(
    @Param('kind') kind: string,
    @Query() query: SchoolCashReportQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.reportUseCase.execute(
      actor(user),
      kind,
      query.dateFrom,
      query.dateTo,
    );
  }
}

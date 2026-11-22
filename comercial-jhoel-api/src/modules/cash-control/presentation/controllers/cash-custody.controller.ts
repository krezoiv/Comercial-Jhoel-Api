import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  GetCashCountUseCase,
  GetCashCustodyUseCase,
  GetLatestCashCountUseCase,
  GetWarehouseTransferUseCase,
  ListCashCountsUseCase,
  ListWarehouseMovementsUseCase,
  ListWarehouseTransfersUseCase,
  RegisterCashCountUseCase,
  RegisterWarehouseInitialBalanceUseCase,
  RegisterWarehouseTransferUseCase,
  VoidWarehouseTransferUseCase,
  GetWarehouseWithdrawalUseCase,
  ListWarehouseWithdrawalsUseCase,
  GetCashInventoryUseCase,
  RegisterWarehouseCashCountUseCase,
  ListWarehouseCashCountsUseCase,
  RegisterWarehouseCashAuditUseCase,
  ListWarehouseCashAuditsUseCase,
  GetWarehouseCashAuditUseCase,
  GetCashCountDraftUseCase,
  SaveCashCountDraftUseCase,
  DiscardCashCountDraftUseCase,
  ListCustodyTransfersUseCase,
  RegisterWarehouseWithdrawalUseCase,
  VoidWarehouseWithdrawalUseCase,
} from '../../application/use-cases/cash-custody.use-cases';
import { ReasonRequestDto } from '../dtos/cash-control.request.dto';
import {
  CashCountsQueryDto,
  CorrectCashCountRequestDto,
  CustodyTransfersQueryDto,
  PageQueryDto,
  RegisterWarehouseCashAuditRequestDto,
  RegisterWarehouseCashCountRequestDto,
  SaveCashCountDraftRequestDto,
  LatestCashCountQueryDto,
  RegisterCashCountRequestDto,
  RegisterWarehouseTransferRequestDto,
  RegisterWarehouseWithdrawalRequestDto,
  WarehouseInitialBalanceRequestDto,
  WarehouseMovementsQueryDto,
  WarehouseTransfersQueryDto,
} from '../dtos/cash-custody.request.dto';

/**
 * Control de Efectivo → "Arqueo de Caja" and "Bodega". Every use case checks
 * its permission (cash_custody.view / operate / authorize) and the SQL
 * functions check operate/authorize again.
 */
@UseGuards(JwtAuthGuard)
@Controller('cash-control')
export class CashCustodyController {
  constructor(
    private readonly getCustody: GetCashCustodyUseCase,
    private readonly registerCount: RegisterCashCountUseCase,
    private readonly listCounts: ListCashCountsUseCase,
    private readonly getCount: GetCashCountUseCase,
    private readonly getLatestCount: GetLatestCashCountUseCase,
    private readonly registerTransfer: RegisterWarehouseTransferUseCase,
    private readonly voidTransfer: VoidWarehouseTransferUseCase,
    private readonly listTransfers: ListWarehouseTransfersUseCase,
    private readonly getTransfer: GetWarehouseTransferUseCase,
    private readonly initialBalance: RegisterWarehouseInitialBalanceUseCase,
    private readonly listWarehouseMovements: ListWarehouseMovementsUseCase,
    private readonly registerWithdrawal: RegisterWarehouseWithdrawalUseCase,
    private readonly voidWithdrawal: VoidWarehouseWithdrawalUseCase,
    private readonly listWithdrawals: ListWarehouseWithdrawalsUseCase,
    private readonly getWithdrawal: GetWarehouseWithdrawalUseCase,
    private readonly getInventory: GetCashInventoryUseCase,
    private readonly registerWarehouseCount: RegisterWarehouseCashCountUseCase,
    private readonly registerWarehouseAudit: RegisterWarehouseCashAuditUseCase,
    private readonly listWarehouseAudits: ListWarehouseCashAuditsUseCase,
    private readonly getWarehouseAudit: GetWarehouseCashAuditUseCase,
    private readonly listWarehouseCounts: ListWarehouseCashCountsUseCase,
    private readonly getDraft: GetCashCountDraftUseCase,
    private readonly saveDraft: SaveCashCountDraftUseCase,
    private readonly discardDraft: DiscardCashCountDraftUseCase,
    private readonly listCustodyTransfers: ListCustodyTransfersUseCase,
  ) {}

  /** Per-denomination inventory of caja and Bodega (derived from counts + movements). */
  @Get('inventory')
  inventory(@CurrentUser() user: RequestUser) {
    return this.getInventory.execute({ role: user.role });
  }

  /** History of the audited Bodega counts. */
  @Get('warehouse/counts')
  warehouseCounts(
    @Query() query: PageQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listWarehouseCounts.execute({ ...query, role: user.role });
  }

  /** "Conteo de Bodega por denominación" (admin): sets the reference of the Bodega inventory. */
  @Post('warehouse/counts')
  @HttpCode(HttpStatus.CREATED)
  createWarehouseCount(
    @Body() dto: RegisterWarehouseCashCountRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerWarehouseCount.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  /** History of the Arqueos de Bodega (control counts with difference). */
  @Get('warehouse/audits')
  warehouseAudits(
    @Query() query: PageQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listWarehouseAudits.execute({ ...query, role: user.role });
  }

  @Get('warehouse/audits/:id')
  warehouseAudit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getWarehouseAudit.execute(id, user.role);
  }

  /**
   * "Arqueo de Bodega" (supervisors and admins): counts Bodega and records the
   * difference against its Kardex. Never adjusts, never moves money.
   */
  @Post('warehouse/audits')
  @HttpCode(HttpStatus.CREATED)
  createWarehouseAudit(
    @Body() dto: RegisterWarehouseCashAuditRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerWarehouseAudit.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  /** Unified history of caja ↔ Bodega transfers (filters: kind, user, dates, status). */
  @Get('custody/transfers')
  custodyTransfers(
    @Query() query: CustodyTransfersQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listCustodyTransfers.execute({ ...query, role: user.role });
  }

  /**
   * The caller's in-progress Arqueo de Caja for the current bank day (or null).
   * Declared before `counts/:id`, like `counts/latest`.
   */
  @Get('counts/draft')
  countDraft(@CurrentUser() user: RequestUser) {
    return this.getDraft.execute({ userId: user.userId, role: user.role });
  }

  /** Autosave of the Arqueo de Caja form (upsert of the caller's own draft). */
  @Put('counts/draft')
  saveCountDraft(
    @Body() dto: SaveCashCountDraftRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.saveDraft.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  /** Explicit "Reiniciar arqueo": discards the caller's draft. */
  @Delete('counts/draft')
  discardCountDraft(@CurrentUser() user: RequestUser) {
    return this.discardDraft.execute({ userId: user.userId, role: user.role });
  }

  /** "Retiro de Bodega" history. */
  @Get('warehouse/withdrawals')
  withdrawals(
    @Query() query: WarehouseTransfersQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listWithdrawals.execute({ ...query, role: user.role });
  }

  @Get('warehouse/withdrawals/:id')
  withdrawal(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getWithdrawal.execute({ id, role: user.role });
  }

  /** Cash out of Bodega: back to the caja or deposited into a bank account. */
  @Post('warehouse/withdrawals')
  @HttpCode(HttpStatus.CREATED)
  createWithdrawal(
    @Body() dto: RegisterWarehouseWithdrawalRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerWithdrawal.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('warehouse/withdrawals/:id/void')
  @HttpCode(HttpStatus.OK)
  voidWarehouseWithdrawal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReasonRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidWithdrawal.execute({
      id,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }

  /** Caja, Bodega and total under custody. */
  @Get('custody')
  custody(@CurrentUser() user: RequestUser) {
    return this.getCustody.execute({ role: user.role });
  }

  @Get('counts')
  counts(@Query() query: CashCountsQueryDto, @CurrentUser() user: RequestUser) {
    return this.listCounts.execute({ ...query, role: user.role });
  }

  /**
   * Latest valid Arqueo de Caja (+ full 12-denomination breakdown) for
   * Cuadre de Agentes. Declared before `counts/:id` so "latest" is not parsed as an id.
   */
  @Get('counts/latest')
  latestCount(
    @Query() query: LatestCashCountQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getLatestCount.execute({
      businessDate: query.businessDate,
      role: user.role,
    });
  }

  @Get('counts/:id')
  count(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getCount.execute({ id, role: user.role });
  }

  @Post('counts')
  @HttpCode(HttpStatus.CREATED)
  createCount(
    @Body() dto: RegisterCashCountRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerCount.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  /** Audited correction: new count with the original photograph; the original becomes REEMPLAZADO. */
  @Post('counts/:id/corrections')
  @HttpCode(HttpStatus.CREATED)
  correctCount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CorrectCashCountRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    const { reason, ...count } = dto;
    return this.registerCount.execute({
      ...count,
      replacesId: id,
      correctionReason: reason,
      userId: user.userId,
      role: user.role,
    });
  }

  @Get('warehouse/movements')
  warehouseMovements(
    @Query() query: WarehouseMovementsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listWarehouseMovements.execute({ ...query, role: user.role });
  }

  @Post('warehouse/initial-balance')
  @HttpCode(HttpStatus.CREATED)
  warehouseInitialBalance(
    @Body() dto: WarehouseInitialBalanceRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.initialBalance.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Get('warehouse/transfers')
  transfers(
    @Query() query: WarehouseTransfersQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.listTransfers.execute({ ...query, role: user.role });
  }

  @Get('warehouse/transfers/:id')
  transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getTransfer.execute({ id, role: user.role });
  }

  @Post('warehouse/transfers')
  @HttpCode(HttpStatus.CREATED)
  createTransfer(
    @Body() dto: RegisterWarehouseTransferRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerTransfer.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('warehouse/transfers/:id/void')
  @HttpCode(HttpStatus.OK)
  voidWarehouseTransfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReasonRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidTransfer.execute({
      id,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }
}

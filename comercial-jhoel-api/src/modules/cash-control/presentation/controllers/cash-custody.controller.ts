import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
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
  RegisterWarehouseWithdrawalUseCase,
  VoidWarehouseWithdrawalUseCase,
} from '../../application/use-cases/cash-custody.use-cases';
import { ReasonRequestDto } from '../dtos/cash-control.request.dto';
import {
  CashCountsQueryDto,
  CorrectCashCountRequestDto,
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
  ) {}

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

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
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetCashBoxBalanceUseCase } from '../../application/use-cases/get-cash-box-balance.use-case';
import { GetCashBoxMovementsUseCase } from '../../application/use-cases/get-cash-box-movements.use-case';
import { RegisterCashBoxWithdrawalUseCase } from '../../application/use-cases/register-cash-box-withdrawal.use-case';
import { RegisterCashBoxContributionUseCase } from '../../application/use-cases/register-cash-box-contribution.use-case';
import { VoidCashBoxMovementUseCase } from '../../application/use-cases/void-cash-box-movement.use-case';
import { CashBoxBalanceQueryDto } from '../dtos/cash-box-balance.query.dto';
import { CashBoxMovementsQueryDto } from '../dtos/cash-box-movements.query.dto';
import { RegisterCashBoxWithdrawalRequestDto } from '../dtos/register-cash-box-withdrawal.request.dto';
import { RegisterCashBoxContributionRequestDto } from '../dtos/register-cash-box-contribution.request.dto';
import { VoidCashBoxMovementRequestDto } from '../dtos/void-cash-box-movement.request.dto';
import { CashBoxBalanceResponseDto } from '../dtos/cash-box-balance.response.dto';
import { PaginatedCashBoxMovementsResponseDto } from '../dtos/cash-box-movement.response.dto';
import { CashBoxMovementRecordResponseDto } from '../dtos/cash-box-movement-record.response.dto';

/**
 * "Gestión Caja Recargas" — a fully independent module (own domain/
 * application/infrastructure/presentation, own controller, no import of
 * `RechargesModule`) backing an accumulated cash balance for Recargas
 * Electrónicas y SIMs. It only ever READS `recharge_sales`/
 * `recharge_sim_sales`/`recharge_purchases`/`recharge_sim_purchases` (see
 * `TypeOrmRechargeCashBoxRepository`'s own doc comment on why
 * `RechargeSaleOrmEntity` is the one class imported across the module
 * boundary) — never writes to any of them, and never touches
 * `recharge_daily_balances`/cuadre/reconciliación.
 *
 * Reading the balance/historial is open to any authenticated, active
 * account — but registering or anulando a manual movement ("Aporte a
 * Caja" or "Salida de Ganancia") is a management action, gated
 * `@Roles('ADMIN','SUPER_ADMIN')` at the method level, same pattern as
 * `BankDepositsController.voidOperation`/día reopen-cancel elsewhere in
 * this codebase.
 */
@UseGuards(JwtAuthGuard)
@Controller('recharge-cash-box')
export class RechargeCashBoxController {
  constructor(
    private readonly getCashBoxBalanceUseCase: GetCashBoxBalanceUseCase,
    private readonly getCashBoxMovementsUseCase: GetCashBoxMovementsUseCase,
    private readonly registerCashBoxWithdrawalUseCase: RegisterCashBoxWithdrawalUseCase,
    private readonly registerCashBoxContributionUseCase: RegisterCashBoxContributionUseCase,
    private readonly voidCashBoxMovementUseCase: VoidCashBoxMovementUseCase,
  ) {}

  @Get('balance')
  getBalance(
    @Query() query: CashBoxBalanceQueryDto,
  ): Promise<CashBoxBalanceResponseDto> {
    return this.getCashBoxBalanceUseCase.execute({ date: query.date });
  }

  @Get('movements')
  getMovements(
    @Query() query: CashBoxMovementsQueryDto,
  ): Promise<PaginatedCashBoxMovementsResponseDto> {
    return this.getCashBoxMovementsUseCase.execute({
      startDate: query.startDate,
      endDate: query.endDate,
      type: query.type,
      page: query.page,
      limit: query.limit,
    });
  }

  @Post('withdrawals')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  registerWithdrawal(
    @Body() dto: RegisterCashBoxWithdrawalRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CashBoxMovementRecordResponseDto> {
    return this.registerCashBoxWithdrawalUseCase.execute({
      amount: dto.amount,
      concept: dto.concept,
      businessDate: dto.businessDate,
      userId,
    });
  }

  @Post('contributions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  registerContribution(
    @Body() dto: RegisterCashBoxContributionRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CashBoxMovementRecordResponseDto> {
    return this.registerCashBoxContributionUseCase.execute({
      amount: dto.amount,
      concept: dto.concept,
      businessDate: dto.businessDate,
      userId,
    });
  }

  @Post('movements/:id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidMovement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidCashBoxMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<CashBoxMovementRecordResponseDto> {
    return this.voidCashBoxMovementUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { ListRechargeTypesUseCase } from '../../application/use-cases/list-recharge-types.use-case';
import { GetRechargeDailySummaryUseCase } from '../../application/use-cases/get-recharge-daily-summary.use-case';
import { RegisterRechargePurchaseUseCase } from '../../application/use-cases/register-recharge-purchase.use-case';
import { RegisterRechargeFinalBalanceUseCase } from '../../application/use-cases/register-recharge-final-balance.use-case';
import {
  GetRechargeHistoryUseCase,
  GetRechargeHistoryOutput,
} from '../../application/use-cases/get-recharge-history.use-case';
import { GetRechargeSalesSummaryUseCase } from '../../application/use-cases/get-recharge-sales-summary.use-case';
import { RegisterRechargeSalesClosureUseCase } from '../../application/use-cases/register-recharge-sales-closure.use-case';
import { GetRechargeSalesUseCase } from '../../application/use-cases/get-recharge-sales.use-case';
import { CreateRechargeSaleUseCase } from '../../application/use-cases/create-recharge-sale.use-case';
import { UpdateRechargeSaleUseCase } from '../../application/use-cases/update-recharge-sale.use-case';
import { DeleteRechargeSaleUseCase } from '../../application/use-cases/delete-recharge-sale.use-case';
import { RegisterRechargePurchaseRequestDto } from '../dtos/register-recharge-purchase.request.dto';
import { RegisterRechargeFinalBalanceRequestDto } from '../dtos/register-recharge-final-balance.request.dto';
import { RegisterRechargeSalesClosureRequestDto } from '../dtos/register-recharge-sales-closure.request.dto';
import { CreateRechargeSaleRequestDto } from '../dtos/create-recharge-sale.request.dto';
import { UpdateRechargeSaleRequestDto } from '../dtos/update-recharge-sale.request.dto';
import { RechargeHistoryQueryDto } from '../dtos/recharge-history.query.dto';
import { RechargeDailyQueryDto } from '../dtos/recharge-daily.query.dto';
import { RechargeSalesSummaryQueryDto } from '../dtos/recharge-sales-summary.query.dto';
import { RechargeSalesQueryDto } from '../dtos/recharge-sales.query.dto';
import { RechargeTypeOutput } from '../../application/dtos/recharge-type-output';
import { RechargeDailyBalanceOutput } from '../../application/dtos/recharge-daily-balance-output';
import { RechargeSalesSummaryOutput } from '../../application/dtos/recharge-sales-summary-output';
import { RechargeSaleOutput } from '../../application/dtos/recharge-sale-output';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No `@Roles(...)` at the class level — same "operational, any
 * authenticated account" policy as Sales/Purchases: registering a purchase
 * or closing a day's balance for the first time is a daily register task,
 * not an admin-only one. The one elevated rule (re-editing an
 * already-closed day requires an admin) lives inside
 * `RegisterRechargeFinalBalanceUseCase`, computed here from the caller's
 * role and passed in as `isAdmin` — not a route guard, since it depends on
 * the target row's own state.
 */
@UseGuards(JwtAuthGuard)
@Controller('recharges')
export class RechargesController {
  constructor(
    private readonly listRechargeTypesUseCase: ListRechargeTypesUseCase,
    private readonly getRechargeDailySummaryUseCase: GetRechargeDailySummaryUseCase,
    private readonly registerRechargePurchaseUseCase: RegisterRechargePurchaseUseCase,
    private readonly registerRechargeFinalBalanceUseCase: RegisterRechargeFinalBalanceUseCase,
    private readonly getRechargeHistoryUseCase: GetRechargeHistoryUseCase,
    private readonly getRechargeSalesSummaryUseCase: GetRechargeSalesSummaryUseCase,
    private readonly registerRechargeSalesClosureUseCase: RegisterRechargeSalesClosureUseCase,
    private readonly getRechargeSalesUseCase: GetRechargeSalesUseCase,
    private readonly createRechargeSaleUseCase: CreateRechargeSaleUseCase,
    private readonly updateRechargeSaleUseCase: UpdateRechargeSaleUseCase,
    private readonly deleteRechargeSaleUseCase: DeleteRechargeSaleUseCase,
  ) {}

  @Get('types')
  findTypes(): Promise<RechargeTypeOutput[]> {
    return this.listRechargeTypesUseCase.execute();
  }

  @Get('daily')
  findDaily(
    @Query() query: RechargeDailyQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeDailyBalanceOutput[]> {
    return this.getRechargeDailySummaryUseCase.execute(userId, query.date);
  }

  @Post('purchases')
  registerPurchase(
    @Body() dto: RegisterRechargePurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeDailyBalanceOutput> {
    return this.registerRechargePurchaseUseCase.execute({
      rechargeTypeId: dto.rechargeTypeId,
      amount: dto.amount,
      operationDate: dto.operationDate,
      userId,
    });
  }

  @Patch('daily/:id/final-balance')
  registerFinalBalance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RegisterRechargeFinalBalanceRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<RechargeDailyBalanceOutput> {
    return this.registerRechargeFinalBalanceUseCase.execute({
      dailyBalanceId: id,
      finalBalance: dto.finalBalance,
      userId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }

  @Get('history')
  findHistory(
    @Query() query: RechargeHistoryQueryDto,
  ): Promise<GetRechargeHistoryOutput> {
    return this.getRechargeHistoryUseCase.execute(query);
  }

  @Get('sales-summary')
  findSalesSummary(
    @Query() query: RechargeSalesSummaryQueryDto,
  ): Promise<RechargeSalesSummaryOutput> {
    return this.getRechargeSalesSummaryUseCase.execute(query.date);
  }

  @Post('sales-closure')
  registerSalesClosure(
    @Body() dto: RegisterRechargeSalesClosureRequestDto,
    @CurrentUser() user: RequestUser,
  ): Promise<RechargeSalesSummaryOutput> {
    return this.registerRechargeSalesClosureUseCase.execute({
      totalCollected: dto.totalCollected,
      operationDate: dto.operationDate,
      userId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }

  @Get('sales')
  findSales(
    @Query() query: RechargeSalesQueryDto,
  ): Promise<RechargeSaleOutput[]> {
    return this.getRechargeSalesUseCase.execute(query.date);
  }

  @Post('sales')
  createSale(
    @Body() dto: CreateRechargeSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSaleOutput> {
    return this.createRechargeSaleUseCase.execute({
      rechargeTypeId: dto.rechargeTypeId,
      phoneNumber: dto.phoneNumber,
      amount: dto.amount,
      operationDate: dto.operationDate,
      userId,
    });
  }

  @Patch('sales/:id')
  updateSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRechargeSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSaleOutput> {
    return this.updateRechargeSaleUseCase.execute({
      id,
      phoneNumber: dto.phoneNumber,
      amount: dto.amount,
      userId,
    });
  }

  @Delete('sales/:id')
  @HttpCode(204)
  deleteSale(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteRechargeSaleUseCase.execute(id);
  }
}

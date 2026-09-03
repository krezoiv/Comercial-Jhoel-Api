import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListRechargeSimTypesUseCase } from '../../application/use-cases/list-recharge-sim-types.use-case';
import { GetRechargeSimDailySummaryUseCase } from '../../application/use-cases/get-recharge-sim-daily-summary.use-case';
import { RegisterRechargeSimPurchaseUseCase } from '../../application/use-cases/register-recharge-sim-purchase.use-case';
import { RegisterRechargeSimSaleUseCase } from '../../application/use-cases/register-recharge-sim-sale.use-case';
import { RechargeSimDailyQueryDto } from '../dtos/recharge-sim-daily.query.dto';
import { RegisterRechargeSimPurchaseRequestDto } from '../dtos/register-recharge-sim-purchase.request.dto';
import { RegisterRechargeSimSaleRequestDto } from '../dtos/register-recharge-sim-sale.request.dto';
import { RechargeSimTypeOutput } from '../../application/dtos/recharge-sim-type-output';
import { RechargeSimDailyStockOutput } from '../../application/dtos/recharge-sim-daily-stock-output';
import { todayIsoDate } from '../../application/utils/today-iso-date';

/**
 * SIM Claro/SIM Tigo — physical, stock-tracked products administered
 * EXCLUSIVELY from Recargas Electrónicas (see the migration's own doc
 * comment for why they're not part of `modules/products/`). A new,
 * separate controller (not added to `RechargesController`) so the existing
 * controller/routes are untouched by this ticket.
 *
 * No `@Roles(...)` — same "any authenticated active account" operational
 * policy as the rest of Recargas (registering a purchase/sale is a daily
 * register task, not admin-only), matching `RechargesController` and
 * Heladería's own purchase/sale controllers.
 */
@UseGuards(JwtAuthGuard)
@Controller('recharges/sims')
export class RechargeSimsController {
  constructor(
    private readonly listRechargeSimTypesUseCase: ListRechargeSimTypesUseCase,
    private readonly getRechargeSimDailySummaryUseCase: GetRechargeSimDailySummaryUseCase,
    private readonly registerRechargeSimPurchaseUseCase: RegisterRechargeSimPurchaseUseCase,
    private readonly registerRechargeSimSaleUseCase: RegisterRechargeSimSaleUseCase,
  ) {}

  @Get('types')
  findTypes(): Promise<RechargeSimTypeOutput[]> {
    return this.listRechargeSimTypesUseCase.execute();
  }

  @Get('daily')
  findDaily(
    @Query() query: RechargeSimDailyQueryDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput[]> {
    return this.getRechargeSimDailySummaryUseCase.execute(
      userId,
      query.date ?? todayIsoDate(),
    );
  }

  @Post('purchases')
  registerPurchase(
    @Body() dto: RegisterRechargeSimPurchaseRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput> {
    return this.registerRechargeSimPurchaseUseCase.execute({
      simTypeId: dto.simTypeId,
      quantity: dto.quantity,
      operationDate: dto.operationDate,
      userId,
    });
  }

  @Post('sales')
  registerSale(
    @Body() dto: RegisterRechargeSimSaleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeSimDailyStockOutput> {
    return this.registerRechargeSimSaleUseCase.execute({
      simTypeId: dto.simTypeId,
      quantity: dto.quantity,
      operationDate: dto.operationDate,
      userId,
    });
  }
}

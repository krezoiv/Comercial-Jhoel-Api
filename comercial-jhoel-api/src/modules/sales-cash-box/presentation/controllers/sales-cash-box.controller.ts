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
import { GetSalesCashBoxBalancesUseCase } from '../../application/use-cases/get-sales-cash-box-balances.use-case';
import { GetSalesCashBoxMovementsUseCase } from '../../application/use-cases/get-sales-cash-box-movements.use-case';
import { RegisterSalesCashBoxContributionUseCase } from '../../application/use-cases/register-sales-cash-box-contribution.use-case';
import { RegisterSalesCashBoxWithdrawalUseCase } from '../../application/use-cases/register-sales-cash-box-withdrawal.use-case';
import { VoidSalesCashBoxMovementUseCase } from '../../application/use-cases/void-sales-cash-box-movement.use-case';
import { RegisterSalesCashBoxMovementRequestDto } from '../dtos/register-sales-cash-box-movement.request.dto';
import { VoidSalesCashBoxMovementRequestDto } from '../dtos/void-sales-cash-box-movement.request.dto';
import { SalesCashBoxMovementsQueryDto } from '../dtos/sales-cash-box-movements.query.dto';

/**
 * "Caja de Ventas" por negocio — saldo acumulado independiente por
 * `business_id`, mismo patrón que `RechargeCashBoxController` (módulo
 * propio, solo LEE `sales`/`sale_details`, nunca escribe en ellas). Leer
 * saldos/movimientos es operativo (cualquier cuenta autenticada activa);
 * registrar o anular un "Aporte"/"Retiro" es una acción de gestión,
 * `@Roles('ADMIN','SUPER_ADMIN')` a nivel de método — mismo criterio exacto
 * que Recargas ya usa para su propia Caja Contable.
 */
@UseGuards(JwtAuthGuard)
@Controller('sales-cash-box')
export class SalesCashBoxController {
  constructor(
    private readonly getBalancesUseCase: GetSalesCashBoxBalancesUseCase,
    private readonly getMovementsUseCase: GetSalesCashBoxMovementsUseCase,
    private readonly registerContributionUseCase: RegisterSalesCashBoxContributionUseCase,
    private readonly registerWithdrawalUseCase: RegisterSalesCashBoxWithdrawalUseCase,
    private readonly voidMovementUseCase: VoidSalesCashBoxMovementUseCase,
  ) {}

  @Get('balances')
  getBalances() {
    return this.getBalancesUseCase.execute();
  }

  @Get('movements')
  getMovements(@Query() query: SalesCashBoxMovementsQueryDto) {
    return this.getMovementsUseCase.execute({
      businessId: query.businessId,
      limit: query.limit,
    });
  }

  @Post('contributions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  registerContribution(
    @Body() dto: RegisterSalesCashBoxMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerContributionUseCase.execute({
      businessId: dto.businessId,
      amount: dto.amount,
      concept: dto.concept,
      userId,
    });
  }

  @Post('withdrawals')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  registerWithdrawal(
    @Body() dto: RegisterSalesCashBoxMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerWithdrawalUseCase.execute({
      businessId: dto.businessId,
      amount: dto.amount,
      concept: dto.concept,
      userId,
    });
  }

  @Post('movements/:id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidMovement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidSalesCashBoxMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.voidMovementUseCase.execute({
      id,
      voidedBy: userId,
      reason: dto.reason,
    });
  }
}

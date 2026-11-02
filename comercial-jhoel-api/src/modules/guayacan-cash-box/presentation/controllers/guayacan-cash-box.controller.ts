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
import { GetGuayacanCashBoxSummaryUseCase } from '../../application/use-cases/get-guayacan-cash-box-summary.use-case';
import { ListGuayacanCashMovementsUseCase } from '../../application/use-cases/list-guayacan-cash-movements.use-case';
import { GetGuayacanCashMovementUseCase } from '../../application/use-cases/get-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashMovementUseCase } from '../../application/use-cases/register-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashAdjustmentUseCase } from '../../application/use-cases/register-guayacan-cash-adjustment.use-case';
import { VoidGuayacanCashMovementUseCase } from '../../application/use-cases/void-guayacan-cash-movement.use-case';
import { RegisterGuayacanCashCountUseCase } from '../../application/use-cases/register-guayacan-cash-count.use-case';
import { GetLatestGuayacanCashCountUseCase } from '../../application/use-cases/get-latest-guayacan-cash-count.use-case';
import {
  GuayacanCashMovementsQueryDto,
  RegisterGuayacanCashAdjustmentRequestDto,
  RegisterGuayacanCashCountRequestDto,
  RegisterGuayacanCashMovementRequestDto,
  VoidGuayacanCashMovementRequestDto,
} from '../dtos/guayacan-cash-box.request.dto';

/**
 * "Cuadre de Caja Guayacán" — Kardex propio, independiente de Recargas,
 * Caja de Ventas y saldos bancarios. Política (mismo criterio que
 * Transaccionar, donde nacen las comisiones): leer, registrar ingresos/
 * egresos y arqueos es operativo (cualquier cuenta autenticada activa);
 * AJUSTES y ANULACIONES son de gestión (`@Roles` admin). Ninguna ruta es
 * pública. Las comisiones nunca se registran por aquí: las genera el
 * trigger de `bank_deposit_operations`.
 */
@UseGuards(JwtAuthGuard)
@Controller('guayacan-cash-box')
export class GuayacanCashBoxController {
  constructor(
    private readonly getSummaryUseCase: GetGuayacanCashBoxSummaryUseCase,
    private readonly listMovementsUseCase: ListGuayacanCashMovementsUseCase,
    private readonly getMovementUseCase: GetGuayacanCashMovementUseCase,
    private readonly registerMovementUseCase: RegisterGuayacanCashMovementUseCase,
    private readonly registerAdjustmentUseCase: RegisterGuayacanCashAdjustmentUseCase,
    private readonly voidMovementUseCase: VoidGuayacanCashMovementUseCase,
    private readonly registerCountUseCase: RegisterGuayacanCashCountUseCase,
    private readonly getLatestCountUseCase: GetLatestGuayacanCashCountUseCase,
  ) {}

  @Get('summary')
  summary() {
    return this.getSummaryUseCase.execute();
  }

  @Get('movements')
  movements(@Query() query: GuayacanCashMovementsQueryDto) {
    return this.listMovementsUseCase.execute(query);
  }

  @Get('movements/:id')
  movement(@Param('id', ParseUUIDPipe) id: string) {
    return this.getMovementUseCase.execute(id);
  }

  @Post('movements')
  @HttpCode(HttpStatus.CREATED)
  registerMovement(
    @Body() dto: RegisterGuayacanCashMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerMovementUseCase.execute({ ...dto, userId });
  }

  @Post('adjustments')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  registerAdjustment(
    @Body() dto: RegisterGuayacanCashAdjustmentRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerAdjustmentUseCase.execute({ ...dto, userId });
  }

  @Post('movements/:id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  voidMovement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidGuayacanCashMovementRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.voidMovementUseCase.execute({ id, reason: dto.reason, userId });
  }

  @Get('counts/latest')
  latestCount() {
    return this.getLatestCountUseCase.execute();
  }

  @Post('counts')
  @HttpCode(HttpStatus.CREATED)
  registerCount(
    @Body() dto: RegisterGuayacanCashCountRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.registerCountUseCase.execute({ ...dto, userId });
  }
}

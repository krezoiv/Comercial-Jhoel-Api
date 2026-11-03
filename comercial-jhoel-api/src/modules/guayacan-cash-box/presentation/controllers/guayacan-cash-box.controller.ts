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
import { ListGuayacanCashCountsUseCase } from '../../application/use-cases/list-guayacan-cash-counts.use-case';
import { GetGuayacanCashCountUseCase } from '../../application/use-cases/get-guayacan-cash-count.use-case';
import { ListGuayacanCashCountUsersUseCase } from '../../application/use-cases/list-guayacan-cash-count-users.use-case';
import { ListGuayacanCommissionsUseCase } from '../../application/use-cases/list-guayacan-commissions.use-case';
import {
  GuayacanCashCountsQueryDto,
  GuayacanCashMovementsQueryDto,
  GuayacanCommissionsQueryDto,
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
    private readonly listCountsUseCase: ListGuayacanCashCountsUseCase,
    private readonly getCountUseCase: GetGuayacanCashCountUseCase,
    private readonly listCountUsersUseCase: ListGuayacanCashCountUsersUseCase,
    private readonly listCommissionsUseCase: ListGuayacanCommissionsUseCase,
  ) {}

  /** Comisiones (concepto propio — nunca efectivo de caja). */
  @Get('commissions')
  commissions(@Query() query: GuayacanCommissionsQueryDto) {
    return this.listCommissionsUseCase.execute(query);
  }

  /** Historial de arqueos (Cajas y Cierres). `latest`/`users` se declaran antes de `:id`. */
  @Get('counts')
  counts(@Query() query: GuayacanCashCountsQueryDto) {
    return this.listCountsUseCase.execute(query);
  }

  @Get('counts/users')
  countUsers() {
    return this.listCountUsersUseCase.execute();
  }

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

  @Get('counts/:id')
  count(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCountUseCase.execute(id);
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

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { GetCashPositionUseCase } from '../../application/use-cases/get-cash-position.use-case';
import { RegisterCashBankDepositUseCase } from '../../application/use-cases/register-cash-bank-deposit.use-case';
import {
  GetCashBalanceUseCase,
  GetCashBankBalancesUseCase,
  GetCashMovementUseCase,
  GetRecentCashMovementsUseCase,
  ListCashMovementsUseCase,
  ListCashBankDaysUseCase,
  GetCashBankDayUseCase,
  ListCashUsersUseCase,
} from '../../application/use-cases/cash-movement-queries.use-cases';
import {
  RegisterCashMovementUseCase,
  VoidCashMovementUseCase,
} from '../../application/use-cases/cash-movement-commands.use-cases';
import {
  CloseCashDayUseCase,
  FinishCashCutUseCase,
  OpenCashDayUseCase,
  ReopenCashCutUseCase,
  StartCashCutUseCase,
  UpdateCashCutScheduleUseCase,
} from '../../application/use-cases/cash-cut-commands.use-cases';
import {
  GetCashCutDetailUseCase,
  ListCashDaysUseCase,
} from '../../application/use-cases/cash-cut-queries.use-cases';
import {
  CashDaysQueryDto,
  CashMovementsQueryDto,
  CashBankDaysQueryDto,
  CloseCashDayRequestDto,
  FinishCashCutRequestDto,
  OpenCashDayRequestDto,
  ReasonRequestDto,
  RecentCashMovementsQueryDto,
  RegisterCashBankDepositRequestDto,
  RegisterCashMovementRequestDto,
  UpdateCashCutScheduleRequestDto,
} from '../dtos/cash-control.request.dto';

/**
 * Finance → Control de Efectivo (`/cash-control`). Every route requires a
 * valid JWT. Policy:
 * - Reading the balance, Kardex, recent movements and cut history: any
 *   authenticated account (the cash balance is shown in Transaccionar).
 * - Opening the day, scheduling/starting/finishing cuts, closing the day and
 *   manual entradas/salidas: SUPER_ADMIN, ADMIN, SUPERVISOR_DE_TURNO.
 * - Adjustments, initial balance, voids, reopening a cut and authorizing a
 *   manual opening amount: SUPER_ADMIN, ADMIN.
 * The use cases re-check the role (defense in depth); the balance itself is
 * never accepted from the client.
 */
@UseGuards(JwtAuthGuard)
@Controller('cash-control')
export class CashControlController {
  constructor(
    private readonly getPositionUseCase: GetCashPositionUseCase,
    private readonly getBalanceUseCase: GetCashBalanceUseCase,
    private readonly listMovementsUseCase: ListCashMovementsUseCase,
    private readonly listBankDaysUseCase: ListCashBankDaysUseCase,
    private readonly getBankDayUseCase: GetCashBankDayUseCase,
    private readonly getRecentUseCase: GetRecentCashMovementsUseCase,
    private readonly getMovementUseCase: GetCashMovementUseCase,
    private readonly listUsersUseCase: ListCashUsersUseCase,
    private readonly getBankBalancesUseCase: GetCashBankBalancesUseCase,
    private readonly registerMovementUseCase: RegisterCashMovementUseCase,
    private readonly voidMovementUseCase: VoidCashMovementUseCase,
    private readonly openDayUseCase: OpenCashDayUseCase,
    private readonly updateScheduleUseCase: UpdateCashCutScheduleUseCase,
    private readonly startCutUseCase: StartCashCutUseCase,
    private readonly finishCutUseCase: FinishCashCutUseCase,
    private readonly reopenCutUseCase: ReopenCashCutUseCase,
    private readonly closeDayUseCase: CloseCashDayUseCase,
    private readonly listDaysUseCase: ListCashDaysUseCase,
    private readonly registerBankDepositUseCase: RegisterCashBankDepositUseCase,
    private readonly getCutDetailUseCase: GetCashCutDetailUseCase,
  ) {}

  @Get('position')
  position() {
    return this.getPositionUseCase.execute();
  }

  @Get('balance')
  balance() {
    return this.getBalanceUseCase.execute();
  }

  @Get('movements')
  movements(@Query() query: CashMovementsQueryDto) {
    return this.listMovementsUseCase.execute(query);
  }

  /** Bank operational days (Agentes Bancarios openings) with their daily indicators — newest first. */
  @Get('bank-days')
  bankDays(@Query() query: CashBankDaysQueryDto) {
    return this.listBankDaysUseCase.execute(query.limit ?? 60);
  }

  /** Original indicators of one bank day (read only). */
  @Get('bank-days/:date')
  bankDay(@Param('date') date: string) {
    return this.getBankDayUseCase.execute(date);
  }

  @Get('movements/recent')
  recent(@Query() query: RecentCashMovementsQueryDto) {
    return this.getRecentUseCase.execute(query.limit ?? 10);
  }

  @Get('movements/:id')
  movement(@Param('id', ParseUUIDPipe) id: string) {
    return this.getMovementUseCase.execute(id);
  }

  @Get('users')
  users() {
    return this.listUsersUseCase.execute();
  }

  @Get('bank-balances')
  bankBalances() {
    return this.getBankBalancesUseCase.execute();
  }

  @Post('movements')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.CREATED)
  registerMovement(
    @Body() dto: RegisterCashMovementRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerMovementUseCase.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  /** "Depósito bancario": cash leaves the caja and is credited to the selected account (with breakdown). */
  @Post('bank-deposits')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.CREATED)
  registerBankDeposit(
    @Body() dto: RegisterCashBankDepositRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerBankDepositUseCase.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('movements/:id/void')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  voidMovement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReasonRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.voidMovementUseCase.execute({
      id,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('days/open')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.OK)
  openDay(
    @Body() dto: OpenCashDayRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.openDayUseCase.execute({
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('days/:id/close')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.OK)
  closeDay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseCashDayRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.closeDayUseCase.execute({
      dayId: id,
      observations: dto.observations,
      userId: user.userId,
      role: user.role,
    });
  }

  /** Historial de Cortes (one row per operational day with both cuts). */
  @Get('days')
  days(@Query() query: CashDaysQueryDto) {
    return this.listDaysUseCase.execute(query);
  }

  @Get('cuts/:id')
  cut(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCutDetailUseCase.execute(id);
  }

  @Patch('cuts/:id/schedule')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  updateSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCashCutScheduleRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.updateScheduleUseCase.execute({
      periodId: id,
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('cuts/:id/start')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.OK)
  startCut(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.startCutUseCase.execute({
      periodId: id,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('cuts/:id/finish')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')
  @HttpCode(HttpStatus.OK)
  finishCut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FinishCashCutRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.finishCutUseCase.execute({
      periodId: id,
      ...dto,
      userId: user.userId,
      role: user.role,
    });
  }

  @Post('cuts/:id/reopen')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  reopenCut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReasonRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.reopenCutUseCase.execute({
      periodId: id,
      reason: dto.reason,
      userId: user.userId,
      role: user.role,
    });
  }
}

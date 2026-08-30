import {
  Body,
  Controller,
  Delete,
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
import { CreateBankUseCase } from '../../application/use-cases/create-bank.use-case';
import { ListBanksUseCase } from '../../application/use-cases/list-banks.use-case';
import { GetBankByIdUseCase } from '../../application/use-cases/get-bank-by-id.use-case';
import { UpdateBankUseCase } from '../../application/use-cases/update-bank.use-case';
import { DeactivateBankUseCase } from '../../application/use-cases/deactivate-bank.use-case';
import { GetBankBalancesViewUseCase } from '../../application/use-cases/get-bank-balances-view.use-case';
import { SaveBankBalancesUseCase } from '../../application/use-cases/save-bank-balances.use-case';
import { GetCuadreAgentesSummaryUseCase } from '../../application/use-cases/get-cuadre-agentes-summary.use-case';
import { ValidateBankBalancesForDateUseCase } from '../../application/use-cases/validate-bank-balances-for-date.use-case';
import { GetDayStatusUseCase } from '../../application/use-cases/get-day-status.use-case';
import { OpenDayUseCase } from '../../application/use-cases/open-day.use-case';
import { CreateBankRequestDto } from '../dtos/create-bank.request.dto';
import { UpdateBankRequestDto } from '../dtos/update-bank.request.dto';
import { ListBanksQueryDto } from '../dtos/list-banks.query.dto';
import { BankBalancesViewQueryDto } from '../dtos/bank-balances-view.query.dto';
import { BankBalancesValidationQueryDto } from '../dtos/bank-balances-validation.query.dto';
import { DayStatusQueryDto } from '../dtos/day-status.query.dto';
import { OpenDayRequestDto } from '../dtos/open-day.request.dto';
import { SaveBankBalancesRequestDto } from '../dtos/save-bank-balances.request.dto';
import { BankResponseDto } from '../dtos/bank.response.dto';
import {
  BankBalanceViewResponseDto,
  SaveBankBalancesResponseDto,
} from '../dtos/bank-balance-view.response.dto';
import { CuadreAgentesSummaryOutput } from '../../application/dtos/cuadre-agentes-summary-output';
import { BankBalancesValidationOutput } from '../../application/dtos/bank-balances-validation-output';
import { DayStatusOutput } from '../../application/dtos/day-status-output';
import { todayIsoDate } from '../../application/utils/today-iso-date';

/**
 * CRUD (create/update/deactivate) is admin-only, same policy as
 * CategoriesController/ProductsController — Sistema → Bancos is a
 * management screen. `balances`/`balances/save` are the Agentes Bancarios
 * → Bancos operational routes: any authenticated user can register a
 * day's cuadre, same policy as Purchases/Sales/Recargas (registering an
 * operational figure is not an admin-only action in this app).
 *
 * Route order matters, same lesson as SalesController/ProductsController:
 * `balances`/`balances/save` must be declared before `:id`, or Nest would
 * match them as `GET /banks/:id` with `id="balances"` and fail
 * `ParseUUIDPipe` instead of reaching the intended handler.
 */
@UseGuards(JwtAuthGuard)
@Controller('banks')
export class BanksController {
  constructor(
    private readonly createBankUseCase: CreateBankUseCase,
    private readonly listBanksUseCase: ListBanksUseCase,
    private readonly getBankByIdUseCase: GetBankByIdUseCase,
    private readonly updateBankUseCase: UpdateBankUseCase,
    private readonly deactivateBankUseCase: DeactivateBankUseCase,
    private readonly getBankBalancesViewUseCase: GetBankBalancesViewUseCase,
    private readonly saveBankBalancesUseCase: SaveBankBalancesUseCase,
    private readonly getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase,
    private readonly validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase,
    private readonly getDayStatusUseCase: GetDayStatusUseCase,
    private readonly openDayUseCase: OpenDayUseCase,
  ) {}

  /**
   * "¿Está aperturado el día? ¿Ya se guardaron los saldos? ¿Se puede
   * entrar a Cuadre Agentes? ¿Ya se hizo el cuadre?" — una sola llamada
   * para las cuatro preguntas de la secuencia obligatoria. Cualquier
   * usuario autenticado, misma política que `balances`/`cuadre-agentes-summary`.
   */
  @Get('day-status')
  getDayStatus(@Query() query: DayStatusQueryDto): Promise<DayStatusOutput> {
    return this.getDayStatusUseCase.execute(query.date ?? todayIsoDate());
  }

  /**
   * "Confirmar Apertura" — idempotente (ver `DayOpeningRepository.open`),
   * así que un doble clic o un reintento nunca crea una segunda apertura
   * ni falla. Cualquier usuario autenticado puede aperturar el día, misma
   * política operacional que registrar saldos o hacer el cuadre.
   */
  @Post('day-status/open')
  @HttpCode(HttpStatus.OK)
  openDay(
    @Body() dto: OpenDayRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<DayStatusOutput> {
    return this.openDayUseCase.execute({ date: dto.date ?? todayIsoDate(), userId });
  }

  @Get('balances')
  getBalancesView(
    @Query() query: BankBalancesViewQueryDto,
  ): Promise<BankBalanceViewResponseDto[]> {
    return this.getBankBalancesViewUseCase.execute(query);
  }

  /**
   * Cuadre Agentes (primera etapa) — declared before `:id`, same routing
   * lesson as `balances`/`balances/save` above: a literal segment must be
   * registered ahead of a dynamic `:id` or Nest would try to match it as
   * `GET /banks/:id` and fail `ParseUUIDPipe` instead of reaching this
   * handler. Any authenticated user, same "operational, not admin-only"
   * policy as `balances` — this is a read-only summary, not a management
   * screen.
   */
  @Get('cuadre-agentes-summary')
  getCuadreAgentesSummary(): Promise<CuadreAgentesSummaryOutput> {
    return this.getCuadreAgentesSummaryUseCase.execute();
  }

  /**
   * "¿Se guardaron los saldos bancarios de esta fecha?" — el pre-chequeo
   * que Cuadre Agentes usa para habilitar/bloquear "Guardar Cuadre" en la
   * UI. Esto es solo experiencia de usuario: `CloseAgentDayUseCase`
   * vuelve a correr exactamente esta misma validación server-side antes
   * de guardar, así que un cliente que se salte esta llamada (o mienta
   * sobre su resultado) no logra nada — el guardado real la exige de
   * todas formas. Declarada antes de `:id` por la misma razón de siempre.
   */
  @Get('balances/validation')
  validateBankBalances(
    @Query() query: BankBalancesValidationQueryDto,
  ): Promise<BankBalancesValidationOutput> {
    return this.validateBankBalancesForDateUseCase.execute(query.date ?? todayIsoDate());
  }

  @Post('balances')
  @HttpCode(HttpStatus.CREATED)
  saveBalances(
    @Body() dto: SaveBankBalancesRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<SaveBankBalancesResponseDto> {
    return this.saveBankBalancesUseCase.execute({ ...dto, userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankResponseDto> {
    return this.createBankUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(@Query() query: ListBanksQueryDto): Promise<BankResponseDto[]> {
    return this.listBanksUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BankResponseDto> {
    return this.getBankByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBankRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BankResponseDto> {
    return this.updateBankUseCase.execute(id, { ...dto, updatedBy: userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateBankUseCase.execute(id);
  }
}

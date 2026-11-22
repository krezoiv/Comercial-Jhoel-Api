import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import {
  GetCashIntegrityUseCase,
  GetOpeningStatusUseCase,
  ListIntegrityMovementsUseCase,
  RegisterOpeningCountUseCase,
  ResolveCountDifferenceUseCase,
} from '../../application/use-cases/cash-integrity.use-cases';
import {
  CashIntegrityQueryDto,
  IntegrityMovementsQueryDto,
  RegisterOpeningCountRequestDto,
  ResolveDifferenceRequestDto,
} from '../dtos/cash-integrity.request.dto';

const actor = (user: RequestUser) => ({ userId: user.userId, role: user.role });

/**
 * Auditoría de efectivo and Arqueo de apertura (`/cash-control/...`). Every
 * permission is checked in the use cases and again in SQL: reading needs
 * `cash_custody.view`, the opening count `operate`, a resolution `authorize`.
 * Registered before the other cash-control controllers: `counts/opening/…`
 * must never reach `counts/:id`.
 */
@UseGuards(JwtAuthGuard)
@Controller('cash-control')
export class CashIntegrityController {
  constructor(
    private readonly integrity: GetCashIntegrityUseCase,
    private readonly movements: ListIntegrityMovementsUseCase,
    private readonly openingStatus: GetOpeningStatusUseCase,
    private readonly registerOpening: RegisterOpeningCountUseCase,
    private readonly resolve: ResolveCountDifferenceUseCase,
  ) {}

  /** Findings, count timeline and opening status of a bank day or range. */
  @Get('integrity')
  report(
    @Query() query: CashIntegrityQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.integrity.execute(actor(user), query);
  }

  /** The Kardex movements of an investigation window, in order. */
  @Get('integrity/movements')
  window(
    @Query() query: IntegrityMovementsQueryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.movements.execute(actor(user), query);
  }

  /** Documented resolution of an arqueo difference (admins). */
  @Post('integrity/resolutions')
  @HttpCode(HttpStatus.CREATED)
  createResolution(
    @Body() dto: ResolveDifferenceRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.resolve.execute(actor(user), dto);
  }

  /** Arqueo de apertura of the current bank day (or that it is still pending). */
  @Get('counts/opening/current')
  currentOpening(@CurrentUser() user: RequestUser) {
    return this.openingStatus.execute(actor(user));
  }

  @Post('counts/opening')
  @HttpCode(HttpStatus.CREATED)
  createOpening(
    @Body() dto: RegisterOpeningCountRequestDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.registerOpening.execute(actor(user), dto);
  }
}

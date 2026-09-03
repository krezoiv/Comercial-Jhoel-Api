import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListClosedDaysUseCase } from '../../application/use-cases/list-closed-days.use-case';
import { GetDayDetailUseCase } from '../../application/use-cases/get-day-detail.use-case';
import { ReopenDayUseCase } from '../../application/use-cases/reopen-day.use-case';
import { CancelDayUseCase } from '../../application/use-cases/cancel-day.use-case';
import { ListClosedDaysQueryDto } from '../dtos/list-closed-days.query.dto';
import { DayActionReasonRequestDto } from '../dtos/day-action-reason.request.dto';
import { ClosedDayOutput } from '../../application/dtos/closed-day-output';
import { DayDetailOutput } from '../../application/dtos/day-detail-output';

/**
 * "Sistema → Gestión de Días Cerrados" — a highly sensitive administrative
 * module (reopens/cancels already-closed financial reconciliations).
 * `@Roles` at the class level, same as `RolesController`: EVERY route,
 * including the `GET`s, requires ADMIN/SUPER_ADMIN — this is the real
 * protection; the frontend's Sidebar/adminGuard are UX only.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('closed-days')
export class ClosedDaysController {
  constructor(
    private readonly listClosedDaysUseCase: ListClosedDaysUseCase,
    private readonly getDayDetailUseCase: GetDayDetailUseCase,
    private readonly reopenDayUseCase: ReopenDayUseCase,
    private readonly cancelDayUseCase: CancelDayUseCase,
  ) {}

  @Get()
  findAll(@Query() query: ListClosedDaysQueryDto): Promise<ClosedDayOutput[]> {
    return this.listClosedDaysUseCase.execute(query);
  }

  @Get(':date')
  findOne(@Param('date') date: string): Promise<DayDetailOutput> {
    return this.getDayDetailUseCase.execute(date);
  }

  @Post(':date/reopen')
  reopen(
    @Param('date') date: string,
    @Body() dto: DayActionReasonRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<DayDetailOutput> {
    return this.reopenDayUseCase.execute({ date, userId, reason: dto.reason });
  }

  @Post(':date/cancel')
  cancel(
    @Param('date') date: string,
    @Body() dto: DayActionReasonRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<DayDetailOutput> {
    return this.cancelDayUseCase.execute({ date, userId, reason: dto.reason });
  }
}

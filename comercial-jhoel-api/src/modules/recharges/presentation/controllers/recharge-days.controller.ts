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
import { ListClosedRechargeDaysUseCase } from '../../application/use-cases/list-closed-recharge-days.use-case';
import { GetRechargeDayDetailUseCase } from '../../application/use-cases/get-recharge-day-detail.use-case';
import { ReopenRechargeDayUseCase } from '../../application/use-cases/reopen-recharge-day.use-case';
import { CancelRechargeDayUseCase } from '../../application/use-cases/cancel-recharge-day.use-case';
import { ListRechargeClosedDaysQueryDto } from '../dtos/list-recharge-closed-days.query.dto';
import { RechargeDayActionReasonRequestDto } from '../dtos/recharge-day-action-reason.request.dto';
import { RechargeClosedDayOutput } from '../../application/dtos/recharge-closed-day-output';
import { RechargeDayDetailOutput } from '../../application/dtos/recharge-day-detail-output';

/**
 * "Sistema → Gestión de Días de Recargas" — the Recargas-specific
 * counterpart to Banks' "Gestión de Días Cerrados" (`ClosedDaysController`),
 * fully independent from it: separate table, separate stored functions,
 * separate route. `@Roles` at the class level, same reasoning as
 * `ClosedDaysController`: EVERY route, including the `GET`s, requires
 * ADMIN/SUPER_ADMIN — this is the real protection; the frontend's
 * sidebar/adminGuard are UX only.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('recharge-days')
export class RechargeDaysController {
  constructor(
    private readonly listClosedRechargeDaysUseCase: ListClosedRechargeDaysUseCase,
    private readonly getRechargeDayDetailUseCase: GetRechargeDayDetailUseCase,
    private readonly reopenRechargeDayUseCase: ReopenRechargeDayUseCase,
    private readonly cancelRechargeDayUseCase: CancelRechargeDayUseCase,
  ) {}

  @Get()
  findAll(
    @Query() query: ListRechargeClosedDaysQueryDto,
  ): Promise<RechargeClosedDayOutput[]> {
    return this.listClosedRechargeDaysUseCase.execute(query);
  }

  @Get(':date')
  findOne(@Param('date') date: string): Promise<RechargeDayDetailOutput> {
    return this.getRechargeDayDetailUseCase.execute(date);
  }

  @Post(':date/reopen')
  reopen(
    @Param('date') date: string,
    @Body() dto: RechargeDayActionReasonRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeDayDetailOutput> {
    return this.reopenRechargeDayUseCase.execute({
      date,
      userId,
      reason: dto.reason,
    });
  }

  @Post(':date/cancel')
  cancel(
    @Param('date') date: string,
    @Body() dto: RechargeDayActionReasonRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<RechargeDayDetailOutput> {
    return this.cancelRechargeDayUseCase.execute({
      date,
      userId,
      reason: dto.reason,
    });
  }
}

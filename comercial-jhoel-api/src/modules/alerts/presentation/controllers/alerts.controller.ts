import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import type { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { GetAlertsUseCase } from '../../application/use-cases/get-alerts.use-case';
import { MarkAlertReadUseCase } from '../../application/use-cases/mark-alert-read.use-case';
import { MarkAllAlertsReadUseCase } from '../../application/use-cases/mark-all-alerts-read.use-case';
import { AlertsResponseDto } from '../dtos/alerts.response.dto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

/**
 * No `@Roles(...)` — every authenticated, active account sees the Navbar
 * bell (inventory/recharge alerts are shared operational state; purchase
 * alerts are ownership-scoped inside `GetAlertsUseCase` itself for a
 * non-admin, same split `PurchasesController` already uses).
 */
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly getAlertsUseCase: GetAlertsUseCase,
    private readonly markAlertReadUseCase: MarkAlertReadUseCase,
    private readonly markAllAlertsReadUseCase: MarkAllAlertsReadUseCase,
  ) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser): Promise<AlertsResponseDto> {
    return this.getAlertsUseCase.execute({
      userId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }

  @Post(':key/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(
    @Param('key') key: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.markAlertReadUseCase.execute({ userId, key });
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAllRead(@CurrentUser() user: RequestUser): Promise<void> {
    return this.markAllAlertsReadUseCase.execute({
      userId: user.userId,
      isAdmin: ADMIN_ROLES.includes(user.role),
    });
  }
}

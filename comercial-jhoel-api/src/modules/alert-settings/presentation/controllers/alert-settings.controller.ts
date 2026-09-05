import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { GetAlertSettingsUseCase } from '../../application/use-cases/get-alert-settings.use-case';
import { UpdateAlertSettingsUseCase } from '../../application/use-cases/update-alert-settings.use-case';
import { UpdateAlertSettingsRequestDto } from '../dtos/update-alert-settings.request.dto';
import { AlertSettingsResponseDto } from '../dtos/alert-settings.response.dto';

/**
 * "Configuración de Alertas" — admin-only end to end (class-level
 * `@Roles`), unlike the alerts themselves (`GET /alerts` is open to any
 * authenticated account — seeing your own low-stock/payment-due alerts is
 * operational; changing the threshold everyone alerts against is a
 * management decision).
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('alert-settings')
export class AlertSettingsController {
  constructor(
    private readonly getAlertSettingsUseCase: GetAlertSettingsUseCase,
    private readonly updateAlertSettingsUseCase: UpdateAlertSettingsUseCase,
  ) {}

  @Get()
  get(): Promise<AlertSettingsResponseDto> {
    return this.getAlertSettingsUseCase.execute();
  }

  @Patch()
  update(
    @Body() dto: UpdateAlertSettingsRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AlertSettingsResponseDto> {
    return this.updateAlertSettingsUseCase.execute({
      purchasePaymentAlertDays: dto.purchasePaymentAlertDays,
      updatedBy: userId,
    });
  }
}

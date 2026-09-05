import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { GetDashboardSummaryUseCase } from '../../application/use-cases/get-dashboard-summary.use-case';
import { DashboardSummaryResponseDto } from '../dtos/dashboard-summary.response.dto';

/**
 * Backs the Resumen dashboard's financial indicator cards (Ventas de
 * Recargas / Ventas / Compras / Transacciones Bancarias). Admin-only
 * (`@Roles`) — unlike `GET /bank-deposits/monthly-count` (a single,
 * non-sensitive count open to any authenticated account), this endpoint
 * exposes real sales/purchase/recharge amounts, the same class of data
 * that's `@Roles('ADMIN', 'SUPER_ADMIN')`-gated everywhere else in this
 * codebase (Reportería). A `USER`-role account still sees the rest of
 * Resumen unchanged; the frontend simply never requests this endpoint for
 * that role (see the app's own `CLAUDE.md`) — this route is the real
 * enforcement regardless of what the frontend does.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase,
  ) {}

  @Get('summary')
  getSummary(): Promise<DashboardSummaryResponseDto> {
    return this.getDashboardSummaryUseCase.execute();
  }
}

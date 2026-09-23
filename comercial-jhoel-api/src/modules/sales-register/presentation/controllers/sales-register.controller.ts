import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GetSalesRegisterSummaryUseCase } from '../../application/use-cases/get-sales-register-summary.use-case';
import { SalesRegisterSummaryQueryDto } from '../dtos/sales-register-summary.query.dto';

/**
 * "Gestión de Caja de Ventas" — read-only, live view over `sales`/
 * `sale_details` grouped by negocio. Operational, any authenticated active
 * account (no `@Roles(...)`) — same policy as `recharge-cash-box`'s own
 * balance read: any cajero should be able to see today's numbers, not just
 * an admin. It has no write route at all (see the module's own doc
 * comment), unlike `recharge-cash-box`, which needed `@Roles(...)` on its
 * contribute/withdraw/void mutations — there is nothing to mutate here.
 */
@UseGuards(JwtAuthGuard)
@Controller('sales-register')
export class SalesRegisterController {
  constructor(
    private readonly getSummaryUseCase: GetSalesRegisterSummaryUseCase,
  ) {}

  @Get('summary')
  getSummary(@Query() query: SalesRegisterSummaryQueryDto) {
    return this.getSummaryUseCase.execute({ date: query.date });
  }
}

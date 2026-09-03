import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CloseAgentDayUseCase } from '../../application/use-cases/close-agent-day.use-case';
import { AgentReconciliationOutput } from '../../application/dtos/agent-reconciliation-output';
import { CreateAgentReconciliationRequestDto } from '../dtos/create-agent-reconciliation.request.dto';
import { todayIsoDate } from '../../application/utils/today-iso-date';

/**
 * "Guardar Cuadre" (Cuadre Agentes) — any authenticated account, same
 * "operational, not admin-only" policy as `POST /banks/balances`/
 * `POST /recharges/*`. Since the "Cierre del Día" ticket, this same call
 * also officially closes the day (see `CloseAgentDayUseCase`) — the route
 * and the request DTO didn't change, only what happens server-side on save.
 */
@UseGuards(JwtAuthGuard)
@Controller('agent-reconciliations')
export class AgentReconciliationsController {
  constructor(
    private readonly closeAgentDayUseCase: CloseAgentDayUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAgentReconciliationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AgentReconciliationOutput> {
    return this.closeAgentDayUseCase.execute({
      totalCash: dto.totalCash,
      date: dto.date ?? todayIsoDate(),
      userId,
    });
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateAgentReconciliationUseCase } from '../../application/use-cases/create-agent-reconciliation.use-case';
import { AgentReconciliationOutput } from '../../application/dtos/agent-reconciliation-output';
import { CreateAgentReconciliationRequestDto } from '../dtos/create-agent-reconciliation.request.dto';
import { todayIsoDate } from '../../application/utils/today-iso-date';

/**
 * "Guardar Cuadre" (Cuadre Agentes, segunda etapa) — any authenticated
 * account, same "operational, not admin-only" policy as
 * `POST /banks/balances`/`POST /recharges/*`: registering a cuadre is a
 * day-to-day agent action, not a Sistema management one.
 */
@UseGuards(JwtAuthGuard)
@Controller('agent-reconciliations')
export class AgentReconciliationsController {
  constructor(
    private readonly createAgentReconciliationUseCase: CreateAgentReconciliationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateAgentReconciliationRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<AgentReconciliationOutput> {
    return this.createAgentReconciliationUseCase.execute({
      totalCash: dto.totalCash,
      date: dto.date ?? todayIsoDate(),
      userId,
    });
  }
}

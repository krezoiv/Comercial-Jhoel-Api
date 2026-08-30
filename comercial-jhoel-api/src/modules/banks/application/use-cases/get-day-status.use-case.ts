import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type { AgentReconciliationRepository } from '../../domain/repositories/agent-reconciliation.repository';
import { ValidateBankBalancesForDateUseCase } from './validate-bank-balances-for-date.use-case';
import { DayStatusOutput, DayWorkStatus } from '../dtos/day-status-output';

/**
 * Combina tres fuentes independientes en una sola respuesta — nunca
 * duplica su lógica: `DayOpeningRepository` (¿aperturado? ¿cerrado?),
 * `ValidateBankBalancesForDateUseCase` (¿saldos guardados? — el mismo
 * use case que ya usa el endpoint de Cuadre Agentes y que
 * `CloseAgentDayUseCase` ya exige al guardar), y
 * `AgentReconciliationRepository` (¿cuadre ya realizado? — informativo,
 * ver `DayWorkStatus`).
 */
@Injectable()
export class GetDayStatusUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    @Inject(AGENT_RECONCILIATION_REPOSITORY)
    private readonly agentReconciliationRepository: AgentReconciliationRepository,
    private readonly validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase,
  ) {}

  async execute(date: string): Promise<DayStatusOutput> {
    const [dayOpening, balancesValidation, reconciliationCompleted] = await Promise.all([
      this.dayOpeningRepository.findByDate(date),
      this.validateBankBalancesForDateUseCase.execute(date),
      this.agentReconciliationRepository.existsForDate(date),
    ]);

    const isOpened = dayOpening !== null;
    const bankBalancesSaved = balancesValidation.canReconcile;
    const isClosed = dayOpening?.isClosed ?? false;

    // "Cierre del Día" bloquea un nuevo cuadre por el flujo normal — una
    // vez cerrada la fecha, Cuadre Agentes vuelve a estar inaccesible,
    // igual que si nunca se hubiera aperturado.
    const canAccessReconciliation = isOpened && bankBalancesSaved && !isClosed;

    let status: DayWorkStatus;
    if (isClosed) {
      status = 'CLOSED';
    } else if (reconciliationCompleted) {
      status = 'RECONCILIATION_COMPLETED';
    } else if (bankBalancesSaved) {
      status = 'BANK_BALANCES_SAVED';
    } else if (isOpened) {
      status = 'OPENED';
    } else {
      status = 'NOT_OPENED';
    }

    return {
      date,
      status,
      isOpened,
      bankBalancesSaved,
      canAccessReconciliation,
      reconciliationCompleted,
      isClosed,
    };
  }
}

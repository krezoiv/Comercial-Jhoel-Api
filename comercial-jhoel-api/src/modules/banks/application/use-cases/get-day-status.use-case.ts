import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type { AgentReconciliationRepository } from '../../domain/repositories/agent-reconciliation.repository';
import { ValidateBankBalancesForDateUseCase } from './validate-bank-balances-for-date.use-case';
import { DayStatusOutput, DayWorkStatus } from '../dtos/day-status-output';

/**
 * Combines three independent sources into a single response — never
 * duplicates their logic: `DayOpeningRepository` (is it open? is it
 * closed?), `ValidateBankBalancesForDateUseCase` (are balances saved? —
 * the same use case the Cuadre Agentes endpoint already uses and that
 * `CloseAgentDayUseCase` already enforces on save), and
 * `AgentReconciliationRepository` (was the cuadre already done? —
 * informational, see `DayWorkStatus`).
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
    const [dayOpening, balancesValidation, reconciliationCompleted] =
      await Promise.all([
        this.dayOpeningRepository.findByDate(date),
        this.validateBankBalancesForDateUseCase.execute(date),
        this.agentReconciliationRepository.existsForDate(date),
      ]);

    const isOpened = dayOpening !== null;
    const bankBalancesSaved = balancesValidation.canReconcile;
    const isClosed = dayOpening?.isClosed ?? false;
    const isCancelled = dayOpening?.isCancelled ?? false;
    const isReopened = dayOpening?.isReopened ?? false;

    // "Cierre del Día" blocks a new cuadre through the normal flow — once
    // a date is closed, Cuadre Agentes becomes inaccessible again, the
    // same as if it had never been opened. A reopening ("Gestión de Días
    // Cerrados") sets `closed_at` back to NULL, so this same computation
    // re-enables everything with no special case needed.
    const canAccessReconciliation = isOpened && bankBalancesSaved && !isClosed;

    let status: DayWorkStatus;
    if (isCancelled) {
      status = 'CANCELLED';
    } else if (isClosed) {
      status = 'CLOSED';
    } else if (isReopened) {
      status = 'REOPENED';
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
      isCancelled,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type { AgentReconciliationRepository } from '../../domain/repositories/agent-reconciliation.repository';
import { BANK_BALANCE_REPOSITORY } from '../../domain/repositories/bank-balance.repository';
import type { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import { DAY_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/day-audit-log.repository';
import type { DayAuditLogRepository } from '../../domain/repositories/day-audit-log.repository';
import { DayNotFoundError } from '../../domain/errors/day-not-found.error';
import { toAgentReconciliationOutput } from '../dtos/agent-reconciliation-output';
import { DayDetailOutput } from '../dtos/day-detail-output';

/**
 * "Ver Detalle" — compone lecturas de cuatro repositorios que ya existen
 * (día, saldos bancarios, cuadre vigente, auditoría), nunca las duplica.
 * Solo aplica a un día que alguna vez tuvo un cierre (`DayNotFoundError`
 * si nunca existió `day_openings` para esa fecha) — un día en curso no es
 * responsabilidad de este módulo administrativo.
 */
@Injectable()
export class GetDayDetailUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY) private readonly dayOpeningRepository: DayOpeningRepository,
    @Inject(AGENT_RECONCILIATION_REPOSITORY)
    private readonly agentReconciliationRepository: AgentReconciliationRepository,
    @Inject(BANK_BALANCE_REPOSITORY) private readonly bankBalanceRepository: BankBalanceRepository,
    @Inject(DAY_AUDIT_LOG_REPOSITORY) private readonly dayAuditLogRepository: DayAuditLogRepository,
  ) {}

  async execute(date: string): Promise<DayDetailOutput> {
    const dayOpening = await this.dayOpeningRepository.findByDate(date);
    if (!dayOpening) {
      throw new DayNotFoundError(date);
    }

    const [banks, reconciliation, auditLog] = await Promise.all([
      this.bankBalanceRepository.findBalancesView(date),
      this.agentReconciliationRepository.findLatestByDate(date),
      this.dayAuditLogRepository.findByDate(date),
    ]);

    const status = dayOpening.isCancelled ? 'CANCELLED' : dayOpening.isClosed ? 'CLOSED' : 'REOPENED';

    return {
      date: dayOpening.date,
      status,
      openedAt: dayOpening.openedAt,
      openedByUsername: dayOpening.openedByUsername,
      closedAt: dayOpening.closedAt,
      closedByUsername: dayOpening.closedBy ? dayOpening.closedByUsername : null,
      reopenedAt: dayOpening.reopenedAt,
      reopenedByUsername: dayOpening.reopenedBy ? dayOpening.reopenedByUsername : null,
      reopenReason: dayOpening.reopenReason,
      isCancelled: dayOpening.isCancelled,
      cancelledAt: dayOpening.cancelledAt,
      cancelledByUsername: dayOpening.cancelledBy ? dayOpening.cancelledByUsername : null,
      cancelReason: dayOpening.cancelReason,
      banks,
      reconciliation: reconciliation ? toAgentReconciliationOutput(reconciliation) : null,
      auditLog: auditLog.map((entry) => ({
        id: entry.id,
        action: entry.action,
        performedByUsername: entry.performedByUsername,
        performedAt: entry.performedAt,
        reason: entry.reason,
        previousStatus: entry.previousStatus,
        newStatus: entry.newStatus,
      })),
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type { AgentReconciliationRepository } from '../../domain/repositories/agent-reconciliation.repository';
import { GetCuadreAgentesSummaryUseCase } from './get-cuadre-agentes-summary.use-case';
import {
  AgentReconciliationOutput,
  toAgentReconciliationOutput,
} from '../dtos/agent-reconciliation-output';

export interface CreateAgentReconciliationInput {
  totalCash: number;
  date: string;
  userId: string;
}

/**
 * Segunda etapa's "Guardar Cuadre" — the one write in this whole feature,
 * and the one place its "no confiar únicamente en el cálculo del
 * frontend" requirement is actually enforced. `totalCash` is the only
 * figure genuinely accepted from the caller (cash counting has no
 * server-side source of truth — there is no `cuadre_conteo` table, just
 * the frontend's own denomination inputs); `totalBanks`/`totalAssets`/
 * `totalAccountsReceivable` are always re-derived here by calling
 * `GetCuadreAgentesSummaryUseCase` fresh, exactly the same use case the
 * summary screen itself already reads from — never taken from the
 * request body at all, so there is nothing for a manipulated payload to
 * override. `result` is likewise always computed here, never trusted
 * from the client, mirroring `register_recharge_sales_closure`'s own
 * "never trust a client-supplied sales total" rule.
 */
@Injectable()
export class CreateAgentReconciliationUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATION_REPOSITORY)
    private readonly repository: AgentReconciliationRepository,
    private readonly getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase,
  ) {}

  async execute(
    input: CreateAgentReconciliationInput,
  ): Promise<AgentReconciliationOutput> {
    const summary = await this.getCuadreAgentesSummaryUseCase.execute();

    const result =
      input.totalCash +
      summary.totalBanks +
      summary.totalAccountsReceivable -
      summary.totalAssets;

    const record = await this.repository.create({
      date: input.date,
      totalCash: input.totalCash,
      totalBanks: summary.totalBanks,
      totalAssets: summary.totalAssets,
      totalAccountsReceivable: summary.totalAccountsReceivable,
      result,
      createdBy: input.userId,
    });

    return toAgentReconciliationOutput(record);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { AGENT_RECONCILIATION_REPOSITORY } from '../../domain/repositories/agent-reconciliation.repository';
import type { AgentReconciliationRepository } from '../../domain/repositories/agent-reconciliation.repository';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { GetCuadreAgentesSummaryUseCase } from './get-cuadre-agentes-summary.use-case';
import { ValidateBankBalancesForDateUseCase } from './validate-bank-balances-for-date.use-case';
import { BankBalancesNotRegisteredError } from '../../domain/errors/bank-balances-not-registered.error';
import { DayNotOpenedError } from '../../domain/errors/day-not-opened.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import {
  AgentReconciliationOutput,
  toAgentReconciliationOutput,
} from '../dtos/agent-reconciliation-output';

export interface CloseAgentDayInput {
  totalCash: number;
  date: string;
  userId: string;
}

/**
 * "Guardar Cuadre" ya no es solo un `INSERT` histórico — desde el ticket
 * de "Cierre del Día" también cierra oficialmente el ciclo de trabajo de
 * esa fecha (`day_openings.closed_at`) en la misma operación atómica (ver
 * `AgentReconciliationRepository.closeDayWithReconciliation` /
 * `close_agent_day` en la base de datos). No existe ningún camino en el
 * que el cuadre quede guardado sin que el día quede cerrado, ni al revés.
 *
 * Las tres validaciones ("¿aperturado?", "¿saldos guardados?", "¿ya
 * cerrado?") se revisan aquí ANTES de tocar la base de datos —igual que
 * antes de este ticket— y se vuelven a revisar dentro de la propia
 * función SQL bajo el lock de la fila de `day_openings`: esta capa es la
 * que da el mensaje de error específico y evita el viaje a la base de
 * datos en el caso común; la función SQL es la garantía real ante una
 * carrera entre dos guardados casi simultáneos para la misma fecha.
 *
 * `totalCash` sigue siendo el único valor que se acepta del cliente —
 * `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` siempre
 * se recalculan aquí desde `GetCuadreAgentesSummaryUseCase`, nunca desde
 * el cuerpo de la petición.
 */
@Injectable()
export class CloseAgentDayUseCase {
  constructor(
    @Inject(AGENT_RECONCILIATION_REPOSITORY)
    private readonly repository: AgentReconciliationRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    private readonly getCuadreAgentesSummaryUseCase: GetCuadreAgentesSummaryUseCase,
    private readonly validateBankBalancesForDateUseCase: ValidateBankBalancesForDateUseCase,
  ) {}

  async execute(
    input: CloseAgentDayInput,
  ): Promise<AgentReconciliationOutput> {
    const dayOpening = await this.dayOpeningRepository.findByDate(input.date);
    if (!dayOpening) {
      throw new DayNotOpenedError(input.date, 'reconciliation');
    }

    if (dayOpening.isClosed) {
      throw new DayAlreadyClosedError(input.date);
    }

    const balancesValidation = await this.validateBankBalancesForDateUseCase.execute(input.date);
    if (!balancesValidation.canReconcile) {
      throw new BankBalancesNotRegisteredError(input.date);
    }

    const summary = await this.getCuadreAgentesSummaryUseCase.execute();

    const result =
      input.totalCash +
      summary.totalBanks +
      summary.totalAccountsReceivable -
      summary.totalAssets;

    const record = await this.repository.closeDayWithReconciliation({
      date: input.date,
      totalCash: input.totalCash,
      totalBanks: summary.totalBanks,
      totalAssets: summary.totalAssets,
      totalAccountsReceivable: summary.totalAccountsReceivable,
      result,
      userId: input.userId,
    });

    return toAgentReconciliationOutput(record);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AgentReconciliation } from '../../domain/entities/agent-reconciliation.entity';
import {
  AgentReconciliationRepository,
  CloseAgentDayData,
} from '../../domain/repositories/agent-reconciliation.repository';
import { DayNotOpenedError } from '../../domain/errors/day-not-opened.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import { BankBalancesNotRegisteredError } from '../../domain/errors/bank-balances-not-registered.error';
import { AgentReconciliationOrmEntity } from './agent-reconciliation.orm-entity';
import { AgentReconciliationMapper } from './agent-reconciliation.mapper';

@Injectable()
export class TypeOrmAgentReconciliationRepository
  implements AgentReconciliationRepository
{
  constructor(
    @InjectRepository(AgentReconciliationOrmEntity)
    private readonly repository: Repository<AgentReconciliationOrmEntity>,
  ) {}

  /**
   * Un único `SELECT close_agent_day(...)` — la función PL/pgSQL hace el
   * `INSERT` en `agent_reconciliations` y el `UPDATE` de
   * `day_openings.closed_at` dentro de su propia transacción implícita
   * (mismo patrón que `register_recharge_sales_closure`/`save_bank_balance`
   * ya usan en este código base). Un `RAISE EXCEPTION` ahí adentro revierte
   * ambas escrituras — nunca puede quedar una sin la otra.
   */
  async closeDayWithReconciliation(
    data: CloseAgentDayData,
  ): Promise<AgentReconciliation> {
    let reconciliationId: string;
    try {
      const rows = await this.repository.manager.query<
        { close_agent_day: string }[]
      >('SELECT close_agent_day($1, $2, $3, $4, $5, $6, $7)', [
        data.date,
        data.totalCash,
        data.totalBanks,
        data.totalAssets,
        data.totalAccountsReceivable,
        data.result,
        data.userId,
      ]);
      reconciliationId = rows[0].close_agent_day;
    } catch (error) {
      throw this.translateCloseError(error);
    }

    const withRelations = await this.repository.findOneOrFail({
      where: { id: reconciliationId },
    });
    return AgentReconciliationMapper.toDomain(withRelations);
  }

  async existsForDate(date: string): Promise<boolean> {
    const count = await this.repository.count({ where: { date } });
    return count > 0;
  }

  async findLatestByDate(date: string): Promise<AgentReconciliation | null> {
    const orm = await this.repository.findOne({ where: { date }, order: { createdAt: 'DESC' } });
    return orm ? AgentReconciliationMapper.toDomain(orm) : null;
  }

  private translateCloseError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, extra] = message.split(':');

    switch (code) {
      case 'DAY_NOT_OPENED':
        return new DayNotOpenedError(extra, 'reconciliation');
      case 'DAY_ALREADY_CLOSED':
        return new DayAlreadyClosedError(extra);
      case 'BANK_BALANCES_NOT_REGISTERED':
        return new BankBalancesNotRegisteredError(extra);
      default:
        return error;
    }
  }
}

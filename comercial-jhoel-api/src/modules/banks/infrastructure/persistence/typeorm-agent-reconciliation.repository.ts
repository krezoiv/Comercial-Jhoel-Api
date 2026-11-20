import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AgentReconciliation } from '../../domain/entities/agent-reconciliation.entity';
import {
  AgentReconciliationRepository,
  CloseAgentDayData,
  CuadreCashBreakdownSource,
  CuadreCashCountSnapshot,
} from '../../domain/repositories/agent-reconciliation.repository';

type SqlRow = Record<string, unknown>;

const numOrNull = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);

function toDetailRows(
  rows: SqlRow[],
): Array<{ denomination: number; quantity: number; subtotal: number }> {
  return rows.map((row) => ({
    denomination: Number(row.denomination),
    quantity: Number(row.quantity),
    subtotal: Number(row.subtotal),
  }));
}
import { DayNotOpenedError } from '../../domain/errors/day-not-opened.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import { BankBalancesNotRegisteredError } from '../../domain/errors/bank-balances-not-registered.error';
import { CuadreCashBreakdownError } from '../../domain/errors/cuadre-cash-breakdown.error';
import { AgentReconciliationOrmEntity } from './agent-reconciliation.orm-entity';
import { AgentReconciliationMapper } from './agent-reconciliation.mapper';

@Injectable()
export class TypeOrmAgentReconciliationRepository implements AgentReconciliationRepository {
  constructor(
    @InjectRepository(AgentReconciliationOrmEntity)
    private readonly repository: Repository<AgentReconciliationOrmEntity>,
  ) {}

  /**
   * A single `SELECT close_agent_day(...)` — the PL/pgSQL function does
   * the `INSERT` into `agent_reconciliations` and the `UPDATE` of
   * `day_openings.closed_at` inside its own implicit transaction (the same
   * pattern `register_recharge_sales_closure`/`save_bank_balance` already
   * use elsewhere in this codebase). A `RAISE EXCEPTION` in there rolls
   * back both writes — one can never be left without the other.
   */
  async closeDayWithReconciliation(
    data: CloseAgentDayData,
  ): Promise<AgentReconciliation> {
    let reconciliationId: string;
    try {
      const params: unknown[] = [
        data.date,
        data.totalCash,
        data.totalBanks,
        data.totalAssets,
        data.totalAccountsReceivable,
        data.result,
        data.userId,
        data.totalWarehouseCash,
      ];
      if (data.cashBreakdown) {
        // Same close + the "Arqueo de Caja" photograph (caja and Bodega
        // counts, theoretical balances, differences), in one SQL transaction.
        const rows = await this.repository.manager.query<{ id: string }[]>(
          'SELECT close_agent_day_with_cash_breakdown($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13::jsonb, $14) AS id',
          [
            ...params,
            JSON.stringify(data.cashBreakdown.details),
            data.cashBreakdown.source,
            data.cashBreakdown.sourceCashCountId,
            data.totalSchoolListPending,
            data.warehouseDetails
              ? JSON.stringify(data.warehouseDetails)
              : null,
            data.observations ?? null,
          ],
        );
        reconciliationId = rows[0].id;
      } else {
        const rows = await this.repository.manager.query<
          { close_agent_day: string }[]
        >('SELECT close_agent_day($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
          ...params,
          data.totalSchoolListPending,
        ]);
        reconciliationId = rows[0].close_agent_day;
      }
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
    const orm = await this.repository.findOne({
      where: { date },
      order: { createdAt: 'DESC' },
    });
    return orm ? AgentReconciliationMapper.toDomain(orm) : null;
  }

  async findCashCount(
    reconciliationId: string,
  ): Promise<CuadreCashCountSnapshot | null> {
    const manager = this.repository.manager;
    const [row] = await manager.query<SqlRow[]>(
      `SELECT b.*, to_char(b.source_business_date, 'YYYY-MM-DD') AS source_business_date_text,
              u.username AS created_by_username
       FROM agent_reconciliation_cash_breakdowns b
       JOIN users u ON u.id = b.created_by
       WHERE b.reconciliation_id = $1`,
      [reconciliationId],
    );
    if (!row) {
      return null;
    }
    const [cashRows, warehouseRows] = await Promise.all([
      manager.query<SqlRow[]>(
        `SELECT denomination, quantity, subtotal FROM agent_reconciliation_cash_details
         WHERE reconciliation_id = $1 ORDER BY denomination DESC`,
        [reconciliationId],
      ),
      manager.query<SqlRow[]>(
        `SELECT denomination, quantity, subtotal FROM agent_reconciliation_warehouse_details
         WHERE reconciliation_id = $1 ORDER BY denomination DESC`,
        [reconciliationId],
      ),
    ]);
    const cashCounted = Number(row.total_cash);
    const cashTheoretical = numOrNull(row.cash_theoretical);
    const warehouseTheoretical = numOrNull(row.warehouse_theoretical);
    const warehouseCounted = numOrNull(row.warehouse_counted);
    const cents = (value: number) => Math.round(value * 100) / 100;
    return {
      reconciliationId,
      source: row.source as CuadreCashBreakdownSource,
      sourceCountNumber: numOrNull(row.source_count_number),
      sourceCutNumber: numOrNull(row.source_cut_number),
      sourceCountedAt: (row.source_counted_at as Date | null) ?? null,
      sourceBusinessDate:
        (row.source_business_date_text as string | null) ?? null,
      modifiedAfterLoad: row.modified_after_load === true,
      cashCounted,
      cashTheoretical,
      cashDifference: numOrNull(row.cash_difference),
      warehouseTheoretical,
      warehouseCounted,
      warehouseDifference: numOrNull(row.warehouse_difference),
      theoreticalTotal:
        cashTheoretical !== null && warehouseTheoretical !== null
          ? cents(cashTheoretical + warehouseTheoretical)
          : null,
      countedTotal:
        warehouseCounted !== null
          ? cents(cashCounted + warehouseCounted)
          : null,
      consolidatedDifference: numOrNull(row.consolidated_difference),
      observations: (row.observations as string | null) ?? null,
      createdByUsername: String(row.created_by_username),
      createdAt: row.created_at as Date,
      cashDetails: toDetailRows(cashRows),
      warehouseDetails: toDetailRows(warehouseRows),
    };
  }

  /** Same `RAISE EXCEPTION '<CODE>:<extra>'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. */
  private translateCloseError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const breakdownError = CuadreCashBreakdownError.fromMessage(message);
    if (breakdownError) {
      return breakdownError;
    }

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

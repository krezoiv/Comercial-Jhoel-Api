import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AgentReconciliationOrmEntity } from '../../../banks/infrastructure/persistence/agent-reconciliation.orm-entity';
import {
  AgentReconciliationsReportFilters,
  AgentReconciliationsReportRepository,
  AgentReconciliationsReportRow,
  AgentReconciliationsReportSummary,
  PaginatedAgentReconciliationsReportResult,
} from '../../domain/repositories/agent-reconciliations-report.repository';

/**
 * `agent_reconciliations.date` is a plain Postgres `DATE` column — filtering
 * uses the same safe lexicographic string comparison `GET /recharges/history`
 * already relies on, no `Date` object start/end-of-day widening needed,
 * unlike Sales'/Purchases' `timestamptz` filters.
 *
 * IMPORTANT: that "hydrates as a string" behavior only holds for TypeORM's
 * own entity-level `find`/`findOne` hydration (which applies the `date`
 * columntype's string coercion). `getRawMany()`/`getRawOne()` (used
 * throughout this repository) bypass that entirely — the raw `pg` driver's
 * own type parser for a `DATE` column returns a JS `Date` object instead
 * (constructed in local time, e.g. `new Date(y, m-1, d)`), not a string.
 * `normalizeDateString()` below exists specifically to convert either shape
 * back to `yyyy-MM-dd` using local-time field getters (matching how the
 * driver itself constructed the `Date`) — omitting this caused a real 500
 * (`isoDate.split is not a function`) in the PDF export path, caught during
 * this ticket's own live verification.
 *
 * Excludes any reconciliation whose date belongs to a day that was later
 * "anulado" via Gestión de Días (`day_openings.is_cancelled`) — same
 * `excludeCancelledDays` reasoning `RechargesReportController` already
 * applies: an anulled day's data stays in the database (never deleted) but
 * must not silently count toward an official business-performance report.
 */
function normalizeDateString(value: string | Date): string {
  if (typeof value === 'string') {
    return value;
  }
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Injectable()
export class TypeOrmAgentReconciliationsReportRepository implements AgentReconciliationsReportRepository {
  constructor(
    @InjectRepository(AgentReconciliationOrmEntity)
    private readonly repository: Repository<AgentReconciliationOrmEntity>,
  ) {}

  async findAll(
    filters: AgentReconciliationsReportFilters,
    page: number,
    limit: number,
  ): Promise<
    PaginatedAgentReconciliationsReportResult<AgentReconciliationsReportRow>
  > {
    const qb = this.baseQuery(filters);

    const total = await qb.clone().getCount();

    qb.select('reconciliation.id', 'id')
      .addSelect('reconciliation.date', 'date')
      .addSelect('reconciliation.totalCash', 'totalCash')
      .addSelect('reconciliation.totalBanks', 'totalBanks')
      .addSelect('reconciliation.totalAssets', 'totalAssets')
      .addSelect(
        'reconciliation.totalAccountsReceivable',
        'totalAccountsReceivable',
      )
      .addSelect('reconciliation.result', 'result')
      .addSelect('reconciliation.createdAt', 'createdAt')
      .addSelect('user.username', 'username')
      .orderBy('reconciliation.date', 'DESC')
      .addOrderBy('reconciliation.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      date: string | Date;
      totalCash: string;
      totalBanks: string;
      totalAssets: string;
      totalAccountsReceivable: string;
      result: string;
      createdAt: Date;
      username: string | null;
    }>();

    return {
      items: rows.map((row) => ({
        id: row.id,
        date: normalizeDateString(row.date),
        totalCash: parseFloat(row.totalCash),
        totalBanks: parseFloat(row.totalBanks),
        totalAssets: parseFloat(row.totalAssets),
        totalAccountsReceivable: parseFloat(row.totalAccountsReceivable),
        result: parseFloat(row.result),
        createdAt: row.createdAt,
        createdByUsername: row.username ?? '—',
      })),
      total,
    };
  }

  async getSummary(
    filters: AgentReconciliationsReportFilters,
  ): Promise<AgentReconciliationsReportSummary> {
    const qb = this.baseQuery(filters);
    qb.select('COUNT(reconciliation.id)', 'recordCount')
      .addSelect('COALESCE(SUM(reconciliation.totalCash), 0)', 'totalCash')
      .addSelect('COALESCE(SUM(reconciliation.totalBanks), 0)', 'totalBanks')
      .addSelect('COALESCE(SUM(reconciliation.totalAssets), 0)', 'totalAssets')
      .addSelect(
        'COALESCE(SUM(reconciliation.totalAccountsReceivable), 0)',
        'totalAccountsReceivable',
      )
      .addSelect('COALESCE(SUM(reconciliation.result), 0)', 'totalResult');

    const raw = await qb.getRawOne<{
      recordCount: string;
      totalCash: string;
      totalBanks: string;
      totalAssets: string;
      totalAccountsReceivable: string;
      totalResult: string;
    }>();

    const recordCount = parseInt(raw?.recordCount ?? '0', 10);
    const totalResult = parseFloat(raw?.totalResult ?? '0');

    return {
      recordCount,
      totalCash: parseFloat(raw?.totalCash ?? '0'),
      totalBanks: parseFloat(raw?.totalBanks ?? '0'),
      totalAssets: parseFloat(raw?.totalAssets ?? '0'),
      totalAccountsReceivable: parseFloat(raw?.totalAccountsReceivable ?? '0'),
      totalResult,
      averageResult: recordCount > 0 ? totalResult / recordCount : 0,
    };
  }

  private baseQuery(
    filters: AgentReconciliationsReportFilters,
  ): SelectQueryBuilder<AgentReconciliationOrmEntity> {
    const qb = this.repository
      .createQueryBuilder('reconciliation')
      .innerJoin('reconciliation.createdByUser', 'user')
      .where(
        'NOT EXISTS (SELECT 1 FROM day_openings d WHERE d.date = reconciliation.date AND d.is_cancelled = true)',
      );

    if (filters.startDate) {
      qb.andWhere('reconciliation.date >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('reconciliation.date <= :endDate', {
        endDate: filters.endDate,
      });
    }

    return qb;
  }
}

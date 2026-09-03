import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DayOpening } from '../../domain/entities/day-opening.entity';
import {
  ClosedDaysFilters,
  ClosedDayViewRow,
  DayOpeningRepository,
} from '../../domain/repositories/day-opening.repository';
import { DayNotFoundError } from '../../domain/errors/day-not-found.error';
import { DayNotClosedError } from '../../domain/errors/day-not-closed.error';
import {
  DayCancelledError,
  DayAlreadyCancelledError,
} from '../../domain/errors/day-cancelled.error';
import { LaterDayExistsError } from '../../domain/errors/later-day-exists.error';
import {
  ReopenReasonRequiredError,
  CancelReasonRequiredError,
} from '../../domain/errors/reason-required.error';
import { DayOpeningOrmEntity } from './day-opening.orm-entity';
import { DayOpeningMapper } from './day-opening.mapper';

@Injectable()
export class TypeOrmDayOpeningRepository implements DayOpeningRepository {
  constructor(
    @InjectRepository(DayOpeningOrmEntity)
    private readonly repository: Repository<DayOpeningOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<DayOpening | null> {
    const orm = await this.repository.findOne({ where: { date } });
    return orm ? DayOpeningMapper.toDomain(orm) : null;
  }

  /**
   * Idempotent: if `date` already has a row, returns it as-is (never
   * creates a second one). The `try/catch` around the
   * `UQ_day_openings_date` violation is the safety net for a double-click
   * race — the same pattern `TypeOrmBankRepository.create` already uses
   * for its own uniqueness — not the primary path.
   */
  async open(date: string, userId: string): Promise<DayOpening> {
    const existing = await this.findByDate(date);
    if (existing) {
      return existing;
    }

    try {
      const orm = this.repository.create({ date, openedBy: userId });
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return DayOpeningMapper.toDomain(withRelations);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const raced = await this.findByDate(date);
        if (raced) {
          return raced;
        }
      }
      throw error;
    }
  }

  /**
   * Lists only dates that were ever closed — never a day still in
   * progress (`NOT_OPENED`/`OPENED`/`BANK_BALANCES_SAVED`), which isn't
   * this administrative module's concern. Each total comes from a
   * subquery correlated to that date's LATEST `agent_reconciliations`
   * row (the same subquery pattern `findBalancesView` already uses for
   * "the most recent previous balance") — there can be more than one
   * historical row if the day was reopened and closed again more than
   * once.
   */
  async findClosedDays(
    filters: ClosedDaysFilters,
  ): Promise<ClosedDayViewRow[]> {
    const qb = this.repository
      .createQueryBuilder('day')
      .leftJoin('day.openedByUser', 'openedByUser')
      .leftJoin('day.closedByUser', 'closedByUser')
      .leftJoin('day.reopenedByUser', 'reopenedByUser')
      .leftJoin('day.cancelledByUser', 'cancelledByUser')
      .where(
        '(day.closedAt IS NOT NULL OR day.reopenedAt IS NOT NULL OR day.isCancelled = true)',
      );

    if (filters.dateFrom) {
      qb.andWhere('day.date >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      qb.andWhere('day.date <= :dateTo', { dateTo: filters.dateTo });
    }
    if (filters.userId) {
      qb.andWhere(
        '(day.openedBy = :userId OR day.closedBy = :userId OR day.reopenedBy = :userId)',
        { userId: filters.userId },
      );
    }
    if (filters.status === 'CANCELLED') {
      qb.andWhere('day.isCancelled = true');
    } else if (filters.status === 'REOPENED') {
      qb.andWhere(
        'day.isCancelled = false AND day.reopenedAt IS NOT NULL AND day.closedAt IS NULL',
      );
    } else if (filters.status === 'CLOSED') {
      qb.andWhere('day.isCancelled = false AND day.closedAt IS NOT NULL');
    }

    qb.select('day.date', 'date')
      .addSelect('day.isCancelled', 'isCancelled')
      .addSelect('day.openedAt', 'openedAt')
      .addSelect('openedByUser.username', 'openedByUsername')
      .addSelect('day.closedAt', 'closedAt')
      .addSelect('closedByUser.username', 'closedByUsername')
      .addSelect('day.reopenedAt', 'reopenedAt')
      .addSelect('reopenedByUser.username', 'reopenedByUsername')
      .addSelect('day.reopenReason', 'reopenReason')
      .addSelect('day.cancelledAt', 'cancelledAt')
      .addSelect('cancelledByUser.username', 'cancelledByUsername')
      .addSelect('day.cancelReason', 'cancelReason')
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_banks', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalBanks',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_cash', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalCash',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_accounts_receivable', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalAccountsReceivable',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_assets', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalAssets',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.result', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'result',
      )
      .orderBy('day.date', 'DESC');

    if (filters.resultSign) {
      const comparator =
        filters.resultSign === 'positive'
          ? '>'
          : filters.resultSign === 'negative'
            ? '<'
            : '=';
      qb.andWhere(
        `(SELECT r.result FROM agent_reconciliations r WHERE r.date = day.date ORDER BY r.created_at DESC LIMIT 1) ${comparator} 0`,
      );
    }

    const rows = await qb.getRawMany<{
      date: string;
      isCancelled: boolean;
      openedAt: Date;
      openedByUsername: string | null;
      closedAt: Date | null;
      closedByUsername: string | null;
      reopenedAt: Date | null;
      reopenedByUsername: string | null;
      reopenReason: string | null;
      cancelledAt: Date | null;
      cancelledByUsername: string | null;
      cancelReason: string | null;
      totalBanks: string | null;
      totalCash: string | null;
      totalAccountsReceivable: string | null;
      totalAssets: string | null;
      result: string | null;
    }>();

    return rows.map((row) => ({
      // `getRawMany()` doesn't go through TypeORM's normal hydration for
      // `date` columns (that plain-string conversion only happens on
      // `find()`/`findOne()`) — the pg driver returns a real `Date` for
      // this raw query, so it has to be formatted by hand to the same
      // `yyyy-MM-dd` shape the rest of the app already uses.
      date: this.formatDateOnly(row.date),
      status: row.isCancelled
        ? 'CANCELLED'
        : row.closedAt
          ? 'CLOSED'
          : 'REOPENED',
      openedAt: row.openedAt,
      openedByUsername: row.openedByUsername ?? '',
      closedAt: row.closedAt,
      closedByUsername: row.closedByUsername,
      reopenedAt: row.reopenedAt,
      reopenedByUsername: row.reopenedByUsername,
      reopenReason: row.reopenReason,
      cancelledAt: row.cancelledAt,
      cancelledByUsername: row.cancelledByUsername,
      cancelReason: row.cancelReason,
      totalBanks: row.totalBanks !== null ? parseFloat(row.totalBanks) : null,
      totalCash: row.totalCash !== null ? parseFloat(row.totalCash) : null,
      totalAccountsReceivable:
        row.totalAccountsReceivable !== null
          ? parseFloat(row.totalAccountsReceivable)
          : null,
      totalAssets:
        row.totalAssets !== null ? parseFloat(row.totalAssets) : null,
      result: row.result !== null ? parseFloat(row.result) : null,
    }));
  }

  async reopen(
    date: string,
    userId: string,
    reason: string,
  ): Promise<DayOpening> {
    try {
      await this.repository.manager.query(
        'SELECT reopen_agent_day($1, $2, $3)',
        [date, userId, reason],
      );
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return DayOpeningMapper.toDomain(updated);
  }

  async cancel(
    date: string,
    userId: string,
    reason: string,
  ): Promise<DayOpening> {
    try {
      await this.repository.manager.query(
        'SELECT cancel_agent_day($1, $2, $3)',
        [date, userId, reason],
      );
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return DayOpeningMapper.toDomain(updated);
  }

  /** UTC getters on purpose — the pg driver builds this `Date` at UTC midnight for a `date` column; using local getters could shift the date by a day depending on the server's timezone. */
  private formatDateOnly(value: string | Date): string {
    if (typeof value === 'string') {
      return value;
    }
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Same `RAISE EXCEPTION '<CODE>[:...]'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. `reopen_agent_day`/`cancel_agent_day` (migration `1758900000000-AddDayReopeningAndAudit`, corrected by `1758900100000-FixLaterDayCheckIncludesReopened`) are the two functions behind `reopen()`/`cancel()` above. */
  private translateError(error: unknown, date: string): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'REOPEN_REASON_REQUIRED':
        return new ReopenReasonRequiredError();
      case 'CANCEL_REASON_REQUIRED':
        return new CancelReasonRequiredError();
      case 'DAY_NOT_FOUND':
        return new DayNotFoundError(date);
      case 'DAY_CANCELLED':
        return new DayCancelledError(date);
      case 'DAY_ALREADY_CANCELLED':
        return new DayAlreadyCancelledError(date);
      case 'DAY_NOT_CLOSED':
        return new DayNotClosedError(date);
      case 'LATER_DAY_EXISTS':
        return new LaterDayExistsError(date);
      default:
        return error;
    }
  }
}

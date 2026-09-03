import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargeDayOpening } from '../../domain/entities/recharge-day-opening.entity';
import {
  RechargeClosedDaysFilters,
  RechargeClosedDayViewRow,
  RechargeDayOpeningRepository,
} from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeDayNotFoundError } from '../../domain/errors/recharge-day-not-found.error';
import { RechargeDayNotClosedError } from '../../domain/errors/recharge-day-not-closed.error';
import {
  RechargeDayCancelledError,
  RechargeDayAlreadyCancelledError,
} from '../../domain/errors/recharge-day-cancelled.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { RechargeDayNotOpenedError } from '../../domain/errors/recharge-day-not-opened.error';
import { RechargeDayNotReadyToCloseError } from '../../domain/errors/recharge-day-not-ready-to-close.error';
import { RechargeLaterDayExistsError } from '../../domain/errors/recharge-later-day-exists.error';
import {
  RechargeReopenReasonRequiredError,
  RechargeCancelReasonRequiredError,
} from '../../domain/errors/recharge-day-reason-required.error';
import { RechargeDayOpeningOrmEntity } from './recharge-day-opening.orm-entity';
import { RechargeDayOpeningMapper } from './recharge-day-opening.mapper';

@Injectable()
export class TypeOrmRechargeDayOpeningRepository implements RechargeDayOpeningRepository {
  constructor(
    @InjectRepository(RechargeDayOpeningOrmEntity)
    private readonly repository: Repository<RechargeDayOpeningOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<RechargeDayOpening | null> {
    const orm = await this.repository.findOne({ where: { date } });
    return orm ? RechargeDayOpeningMapper.toDomain(orm) : null;
  }

  /**
   * Idempotent: if `date` already has a row, returns it as-is (never
   * creates a second one). The `try/catch` around the
   * `UQ_recharge_day_openings_date` violation (the table's own `date`
   * `UNIQUE` constraint) is the safety net for a double-click race — the
   * same pattern `TypeOrmDayOpeningRepository.open` already uses for
   * Banks' identical situation — not the primary path.
   */
  async open(date: string, userId: string): Promise<RechargeDayOpening> {
    const existing = await this.findByDate(date);
    if (existing) {
      return existing;
    }

    try {
      const orm = this.repository.create({ date, openedBy: userId });
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({ where: { id: saved.id } });
      return RechargeDayOpeningMapper.toDomain(withRelations);
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

  async close(date: string, userId: string): Promise<RechargeDayOpening> {
    try {
      await this.repository.manager.query('SELECT close_recharge_day($1, $2)', [date, userId]);
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return RechargeDayOpeningMapper.toDomain(updated);
  }

  /**
   * Lists only dates that were ever closed — never a day still in
   * progress, which isn't this administrative module's concern. Each
   * total comes from a subquery correlated to that date's LATEST
   * `recharge_sales_closures` row, ordered by `sequence DESC` (not
   * `created_at DESC` the way Banks' equivalent subquery orders — this
   * table's own `sequence` column is the authoritative cycle ordinal, see
   * `RechargeSalesClosure`'s own doc comment) — there can be more than
   * one historical row per date given this module's own multi-cycle-per-
   * day cuadre feature. `cycleCount` is the one field Banks' own
   * `ClosedDayViewRow` has no equivalent of, added specifically because
   * of that same feature.
   */
  async findClosedDays(filters: RechargeClosedDaysFilters): Promise<RechargeClosedDayViewRow[]> {
    const qb = this.repository
      .createQueryBuilder('day')
      .leftJoin('day.openedByUser', 'openedByUser')
      .leftJoin('day.closedByUser', 'closedByUser')
      .leftJoin('day.reopenedByUser', 'reopenedByUser')
      .leftJoin('day.cancelledByUser', 'cancelledByUser')
      .where('(day.closedAt IS NOT NULL OR day.reopenedAt IS NOT NULL OR day.isCancelled = true)');

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
      qb.andWhere('day.isCancelled = false AND day.reopenedAt IS NOT NULL AND day.closedAt IS NULL');
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
            .select('c.total_sales', 'value')
            .from('recharge_sales_closures', 'c')
            .where('c.date = day.date')
            .orderBy('c.sequence', 'DESC')
            .limit(1),
        'totalSales',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('c.total_collected', 'value')
            .from('recharge_sales_closures', 'c')
            .where('c.date = day.date')
            .orderBy('c.sequence', 'DESC')
            .limit(1),
        'totalCollected',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('c.result', 'value')
            .from('recharge_sales_closures', 'c')
            .where('c.date = day.date')
            .orderBy('c.sequence', 'DESC')
            .limit(1),
        'result',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'value')
            .from('recharge_sales_closures', 'c')
            .where('c.date = day.date'),
        'cycleCount',
      )
      .orderBy('day.date', 'DESC');

    if (filters.resultSign) {
      const comparator = filters.resultSign === 'positive' ? '>' : filters.resultSign === 'negative' ? '<' : '=';
      qb.andWhere(
        `(SELECT c.result FROM recharge_sales_closures c WHERE c.date = day.date ORDER BY c.sequence DESC LIMIT 1) ${comparator} 0`,
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
      totalSales: string | null;
      totalCollected: string | null;
      result: string | null;
      cycleCount: string;
    }>();

    return rows.map((row) => ({
      // `getRawMany()` doesn't go through TypeORM's normal hydration for
      // `date` columns — the pg driver returns a real `Date` for this raw
      // query, formatted by hand to the same `yyyy-MM-dd` shape the rest
      // of the app already uses (UTC getters, same reasoning as
      // `TypeOrmDayOpeningRepository.formatDateOnly`).
      date: this.formatDateOnly(row.date),
      status: row.isCancelled ? 'CANCELLED' : row.closedAt ? 'CLOSED' : 'REOPENED',
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
      totalSales: row.totalSales !== null ? parseFloat(row.totalSales) : null,
      totalCollected: row.totalCollected !== null ? parseFloat(row.totalCollected) : null,
      result: row.result !== null ? parseFloat(row.result) : null,
      cycleCount: parseInt(row.cycleCount, 10),
    }));
  }

  async reopen(date: string, userId: string, reason: string): Promise<RechargeDayOpening> {
    try {
      await this.repository.manager.query('SELECT reopen_recharge_day($1, $2, $3)', [date, userId, reason]);
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return RechargeDayOpeningMapper.toDomain(updated);
  }

  async cancel(date: string, userId: string, reason: string): Promise<RechargeDayOpening> {
    try {
      await this.repository.manager.query('SELECT cancel_recharge_day($1, $2, $3)', [date, userId, reason]);
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return RechargeDayOpeningMapper.toDomain(updated);
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

  /**
   * Same `RAISE EXCEPTION '<CODE>:<date>'` → domain-error translation
   * pattern as `TypeOrmSaleRepository.translateSaleError` — see that
   * method's own doc comment for why this parsing exists.
   * `close_recharge_day`/`reopen_recharge_day`/`cancel_recharge_day`
   * (migration `1759000000000-CreateRechargeDayOpenings`) are the three
   * functions behind `close()`/`reopen()`/`cancel()` above.
   */
  private translateError(error: unknown, date: string): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message = (error.driverError as { message?: string } | undefined)?.message ?? error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'RECHARGE_REOPEN_REASON_REQUIRED':
        return new RechargeReopenReasonRequiredError();
      case 'RECHARGE_CANCEL_REASON_REQUIRED':
        return new RechargeCancelReasonRequiredError();
      case 'RECHARGE_DAY_NOT_FOUND':
        return new RechargeDayNotFoundError(date);
      case 'RECHARGE_DAY_CANCELLED':
        return new RechargeDayCancelledError(date);
      case 'RECHARGE_DAY_ALREADY_CANCELLED':
        return new RechargeDayAlreadyCancelledError(date);
      case 'RECHARGE_DAY_NOT_CLOSED':
        return new RechargeDayNotClosedError(date);
      case 'RECHARGE_DAY_ALREADY_CLOSED':
        return new RechargeDayAlreadyClosedError(date);
      case 'RECHARGE_DAY_NOT_OPENED':
        return new RechargeDayNotOpenedError(date);
      case 'RECHARGE_DAY_NOT_READY_TO_CLOSE':
        return new RechargeDayNotReadyToCloseError(date);
      case 'RECHARGE_LATER_DAY_EXISTS':
        return new RechargeLaterDayExistsError(date);
      default:
        return error;
    }
  }
}

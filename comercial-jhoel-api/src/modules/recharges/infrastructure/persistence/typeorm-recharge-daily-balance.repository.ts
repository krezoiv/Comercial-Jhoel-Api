import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargeDailyBalance } from '../../domain/entities/recharge-daily-balance.entity';
import {
  FindRechargeHistoryOptions,
  FindRechargeReportSummaryOptions,
  PaginatedResult,
  RechargeDailyBalanceRepository,
  RechargeReportSummary,
  RegisterRechargeFinalBalanceData,
  RegisterRechargePurchaseData,
} from '../../domain/repositories/recharge-daily-balance.repository';
import { RechargeTypeNotFoundError } from '../../domain/errors/recharge-type-not-found.error';
import { RechargeTypeInactiveError } from '../../domain/errors/recharge-type-inactive.error';
import { InvalidRechargeAmountError } from '../../domain/errors/invalid-recharge-amount.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import { DailyBalanceNotFoundError } from '../../domain/errors/daily-balance-not-found.error';
import { InvalidFinalBalanceError } from '../../domain/errors/invalid-final-balance.error';
import { FinalBalanceExceedsDailyError } from '../../domain/errors/final-balance-exceeds-daily.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { RechargeDailyBalanceOrmEntity } from './recharge-daily-balance.orm-entity';
import { RechargeDailyBalanceMapper } from './recharge-daily-balance.mapper';

@Injectable()
export class TypeOrmRechargeDailyBalanceRepository implements RechargeDailyBalanceRepository {
  constructor(
    @InjectRepository(RechargeDailyBalanceOrmEntity)
    private readonly repository: Repository<RechargeDailyBalanceOrmEntity>,
  ) {}

  async ensureDailyBalance(
    rechargeTypeId: string,
    date: string,
    userId: string,
  ): Promise<RechargeDailyBalance> {
    let id: string;
    try {
      const rows = await this.repository.manager.query<
        { ensure_recharge_daily_balance: string }[]
      >('SELECT ensure_recharge_daily_balance($1, $2, $3)', [
        rechargeTypeId,
        date,
        userId,
      ]);
      id = rows[0].ensure_recharge_daily_balance;
    } catch (error) {
      throw this.translateRechargeError(error);
    }
    return this.fetchOrThrow(id);
  }

  async findByTypeAndDate(
    rechargeTypeId: string,
    date: string,
  ): Promise<RechargeDailyBalance | null> {
    const orm = await this.repository.findOne({
      where: { rechargeTypeId, date },
      order: { sequence: 'DESC' },
    });
    if (!orm) {
      return null;
    }
    const totals = await this.sumPurchaseAmounts([orm.id]);
    return RechargeDailyBalanceMapper.toDomain(orm, totals.get(orm.id) ?? 0);
  }

  /** One row per type — the CURRENT (highest-`sequence`) cycle, even if several cycles have accumulated for this date via "Guardar cuadre" resets. */
  async findAllByDate(date: string): Promise<RechargeDailyBalance[]> {
    const orms = await this.repository.find({
      where: { date },
      order: { sequence: 'DESC' },
    });
    const latestByType = new Map<string, RechargeDailyBalanceOrmEntity>();
    for (const orm of orms) {
      if (!latestByType.has(orm.rechargeTypeId)) {
        latestByType.set(orm.rechargeTypeId, orm);
      }
    }
    const latest = Array.from(latestByType.values());
    const totals = await this.sumPurchaseAmounts(latest.map((orm) => orm.id));
    return latest.map((orm) =>
      RechargeDailyBalanceMapper.toDomain(orm, totals.get(orm.id) ?? 0),
    );
  }

  async findById(id: string): Promise<RechargeDailyBalance | null> {
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) {
      return null;
    }
    const totals = await this.sumPurchaseAmounts([orm.id]);
    return RechargeDailyBalanceMapper.toDomain(orm, totals.get(orm.id) ?? 0);
  }

  async registerPurchase(
    data: RegisterRechargePurchaseData,
  ): Promise<RechargeDailyBalance> {
    let dailyBalanceId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_recharge_purchase: string }[]
      >('SELECT register_recharge_purchase($1, $2, $3, $4, $5)', [
        data.rechargeTypeId,
        data.date,
        data.purchaseAmount,
        data.creditedAmount,
        data.userId,
      ]);
      dailyBalanceId = rows[0].register_recharge_purchase;
    } catch (error) {
      throw this.translateRechargeError(error);
    }
    return this.fetchOrThrow(dailyBalanceId);
  }

  /** Real `SUM(recharge_purchases.amount)` per `daily_balance_id` — raw SQL (no ORM entity exists for `recharge_purchases`, consistent with this module's "no ORM entity for a write-only movement table" precedent) rather than a QueryBuilder join, to keep every existing `.find`/`.findOne` read path unchanged. */
  private async sumPurchaseAmounts(
    dailyBalanceIds: string[],
  ): Promise<Map<string, number>> {
    const totals = new Map<string, number>();
    if (dailyBalanceIds.length === 0) {
      return totals;
    }
    const rows = await this.repository.manager.query<
      { daily_balance_id: string; total: string }[]
    >(
      `SELECT daily_balance_id, SUM(amount) AS total FROM recharge_purchases WHERE daily_balance_id = ANY($1) GROUP BY daily_balance_id`,
      [dailyBalanceIds],
    );
    for (const row of rows) {
      totals.set(row.daily_balance_id, parseFloat(row.total));
    }
    return totals;
  }

  async registerFinalBalance(
    data: RegisterRechargeFinalBalanceData,
  ): Promise<RechargeDailyBalance> {
    try {
      await this.repository.manager.query(
        'SELECT register_recharge_final_balance($1, $2, $3)',
        [data.dailyBalanceId, data.finalBalance, data.userId],
      );
    } catch (error) {
      throw this.translateRechargeError(error);
    }
    return this.fetchOrThrow(data.dailyBalanceId);
  }

  async findHistory(
    options: FindRechargeHistoryOptions,
  ): Promise<PaginatedResult<RechargeDailyBalance>> {
    const qb = this.repository
      .createQueryBuilder('balance')
      .leftJoinAndSelect('balance.rechargeType', 'rechargeType')
      .leftJoinAndSelect('balance.createdByUser', 'createdByUser')
      .leftJoinAndSelect('balance.updatedByUser', 'updatedByUser');

    if (options.startDate) {
      qb.andWhere('balance.date >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options.endDate) {
      qb.andWhere('balance.date <= :endDate', { endDate: options.endDate });
    }
    if (options.rechargeTypeId) {
      qb.andWhere('balance.rechargeTypeId = :rechargeTypeId', {
        rechargeTypeId: options.rechargeTypeId,
      });
    }
    if (options.userId) {
      qb.andWhere('balance.createdByUserId = :userId', {
        userId: options.userId,
      });
    }
    if (options.excludeCancelledDays) {
      qb.andWhere(
        `NOT EXISTS (SELECT 1 FROM recharge_day_openings rdo WHERE rdo.date = balance.date AND rdo.is_cancelled = true)`,
      );
    }

    qb.orderBy('balance.date', 'DESC').addOrderBy('rechargeType.name', 'ASC');
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    const totals = await this.sumPurchaseAmounts(orms.map((orm) => orm.id));
    return {
      items: orms.map((orm) =>
        RechargeDailyBalanceMapper.toDomain(orm, totals.get(orm.id) ?? 0),
      ),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async getReportSummary(
    options: FindRechargeReportSummaryOptions,
  ): Promise<RechargeReportSummary> {
    const qb = this.repository.createQueryBuilder('balance');

    if (options.startDate) {
      qb.andWhere('balance.date >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options.endDate) {
      qb.andWhere('balance.date <= :endDate', { endDate: options.endDate });
    }
    if (options.rechargeTypeId) {
      qb.andWhere('balance.rechargeTypeId = :rechargeTypeId', {
        rechargeTypeId: options.rechargeTypeId,
      });
    }
    // Unconditional — this method backs Reportería only, see its own doc
    // comment on the domain interface for why an anulled day's figures must
    // never appear in a management report.
    qb.andWhere(
      `NOT EXISTS (SELECT 1 FROM recharge_day_openings rdo WHERE rdo.date = balance.date AND rdo.is_cancelled = true)`,
    );

    qb.select('COUNT(*)', 'recordCount')
      .addSelect(
        'COUNT(CASE WHEN balance.finalBalance IS NOT NULL THEN 1 END)',
        'closedCount',
      )
      .addSelect(
        'COALESCE(SUM(balance.dailyBalance - balance.previousBalance), 0)',
        'totalPurchases',
      )
      .addSelect(
        'COALESCE(SUM(CASE WHEN balance.finalBalance IS NOT NULL THEN balance.dailyBalance - balance.finalBalance ELSE 0 END), 0)',
        'totalSales',
      );

    const raw = await qb.getRawOne<{
      recordCount: string;
      closedCount: string;
      totalPurchases: string;
      totalSales: string;
    }>();

    return {
      recordCount: parseInt(raw?.recordCount ?? '0', 10),
      closedCount: parseInt(raw?.closedCount ?? '0', 10),
      totalPurchases: parseFloat(raw?.totalPurchases ?? '0'),
      totalSales: parseFloat(raw?.totalSales ?? '0'),
    };
  }

  private async fetchOrThrow(id: string): Promise<RechargeDailyBalance> {
    const balance = await this.findById(id);
    if (!balance) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar el saldo diario recién actualizado.',
      );
    }
    return balance;
  }

  private translateRechargeError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, id] = message.split(':');

    switch (code) {
      case 'RECHARGE_TYPE_NOT_FOUND':
        return new RechargeTypeNotFoundError(id);
      case 'RECHARGE_TYPE_INACTIVE':
        return new RechargeTypeInactiveError();
      case 'INVALID_AMOUNT':
        return new InvalidRechargeAmountError();
      case 'DAY_ALREADY_CLOSED':
        return new DayAlreadyClosedError();
      case 'DAILY_BALANCE_NOT_FOUND':
        return new DailyBalanceNotFoundError(id);
      case 'INVALID_FINAL_BALANCE':
        return new InvalidFinalBalanceError();
      case 'FINAL_BALANCE_EXCEEDS_DAILY':
        return new FinalBalanceExceedsDailyError();
      case 'RECHARGE_DAY_CLOSED':
        return new RechargeDayAlreadyClosedError(id);
      default:
        return error;
    }
  }
}

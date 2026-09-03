import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargeSale } from '../../domain/entities/recharge-sale.entity';
import {
  CreateRechargeSaleData,
  RechargeSaleRepository,
  RechargeTypeSalesTotal,
  UpdateRechargeSaleData,
} from '../../domain/repositories/recharge-sale.repository';
import { RechargeTypeNotFoundError } from '../../domain/errors/recharge-type-not-found.error';
import { RechargeTypeInactiveError } from '../../domain/errors/recharge-type-inactive.error';
import { InvalidRechargeAmountError } from '../../domain/errors/invalid-recharge-amount.error';
import { InvalidPhoneNumberError } from '../../domain/errors/invalid-phone-number.error';
import { DayAlreadyClosedError } from '../../domain/errors/day-already-closed.error';
import { RechargeSaleNotFoundError } from '../../domain/errors/recharge-sale-not-found.error';
import { RechargeSaleLockedError } from '../../domain/errors/recharge-sale-locked.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { RechargeSaleOrmEntity } from './recharge-sale.orm-entity';
import { RechargeSaleMapper } from './recharge-sale.mapper';

/** Every "which rows belong to the CURRENT cycle of each type for `date`" query in this repository resolves it via this same subquery — the highest-`sequence` `recharge_daily_balances` row per type, identical to `TypeOrmRechargeDailyBalanceRepository.findAllByDate`'s own dedup, just expressed in SQL instead of a post-fetch JS `Map`. */
const CURRENT_CYCLE_IDS_SUBQUERY = `
  SELECT DISTINCT ON (recharge_type_id) id
  FROM recharge_daily_balances
  WHERE date = :date
  ORDER BY recharge_type_id, sequence DESC
`;

@Injectable()
export class TypeOrmRechargeSaleRepository implements RechargeSaleRepository {
  constructor(
    @InjectRepository(RechargeSaleOrmEntity)
    private readonly repository: Repository<RechargeSaleOrmEntity>,
  ) {}

  async create(data: CreateRechargeSaleData): Promise<RechargeSale> {
    let id: string;
    try {
      const rows = await this.repository.manager.query<
        { register_recharge_sale: string }[]
      >('SELECT register_recharge_sale($1, $2, $3, $4, $5)', [
        data.rechargeTypeId,
        data.date,
        data.phoneNumber,
        data.amount,
        data.userId,
      ]);
      id = rows[0].register_recharge_sale;
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(id);
  }

  async update(data: UpdateRechargeSaleData): Promise<RechargeSale> {
    try {
      await this.repository.manager.query(
        'SELECT update_recharge_sale($1, $2, $3, $4)',
        [data.id, data.phoneNumber, data.amount, data.userId],
      );
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(data.id);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.manager.query('SELECT delete_recharge_sale($1)', [
        id,
      ]);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async findById(id: string): Promise<RechargeSale | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? RechargeSaleMapper.toDomain(orm) : null;
  }

  async findAllByDate(date: string): Promise<RechargeSale[]> {
    const orms = await this.repository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.rechargeType', 'rechargeType')
      .leftJoinAndSelect('sale.dailyBalance', 'dailyBalance')
      .leftJoinAndSelect('sale.createdByUser', 'createdByUser')
      .leftJoinAndSelect('sale.updatedByUser', 'updatedByUser')
      .where(`sale.dailyBalanceId IN (${CURRENT_CYCLE_IDS_SUBQUERY})`, {
        date,
      })
      .orderBy('sale.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => RechargeSaleMapper.toDomain(orm));
  }

  async getCurrentCycleTotalsByDate(
    date: string,
  ): Promise<RechargeTypeSalesTotal[]> {
    const raw = await this.repository.manager.query<
      { recharge_type_id: string; name: string; total: string }[]
    >(
      `SELECT rt.id AS recharge_type_id, rt.name AS name, COALESCE(SUM(rs.amount), 0) AS total
       FROM recharge_daily_balances rdb
       JOIN recharge_types rt ON rt.id = rdb.recharge_type_id
       LEFT JOIN recharge_sales rs ON rs.daily_balance_id = rdb.id
       WHERE rdb.id IN (
         SELECT DISTINCT ON (recharge_type_id) id
         FROM recharge_daily_balances
         WHERE date = $1
         ORDER BY recharge_type_id, sequence DESC
       )
       GROUP BY rt.id, rt.name`,
      [date],
    );

    return raw.map((row) => ({
      rechargeTypeId: row.recharge_type_id,
      rechargeTypeName: row.name,
      total: parseFloat(row.total),
    }));
  }

  private async fetchOrThrow(id: string): Promise<RechargeSale> {
    const sale = await this.findById(id);
    if (!sale) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la recarga recién guardada.',
      );
    }
    return sale;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. */
  private translateError(error: unknown): unknown {
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
      case 'INVALID_PHONE_NUMBER':
        return new InvalidPhoneNumberError();
      case 'DAY_ALREADY_CLOSED':
        return new DayAlreadyClosedError();
      case 'RECHARGE_SALE_NOT_FOUND':
        return new RechargeSaleNotFoundError(id);
      case 'RECHARGE_SALE_LOCKED':
        return new RechargeSaleLockedError();
      case 'RECHARGE_DAY_CLOSED':
        return new RechargeDayAlreadyClosedError(id);
      default:
        return error;
    }
  }
}

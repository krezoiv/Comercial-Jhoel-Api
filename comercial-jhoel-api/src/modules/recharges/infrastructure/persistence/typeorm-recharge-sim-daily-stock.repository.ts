import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargeSimDailyStock } from '../../domain/entities/recharge-sim-daily-stock.entity';
import {
  RechargeSimDailyStockRepository,
  RegisterRechargeSimPurchaseData,
  RegisterRechargeSimSaleData,
} from '../../domain/repositories/recharge-sim-daily-stock.repository';
import { SimTypeNotFoundError } from '../../domain/errors/sim-type-not-found.error';
import { SimTypeInactiveError } from '../../domain/errors/sim-type-inactive.error';
import { InvalidSimQuantityError } from '../../domain/errors/invalid-sim-quantity.error';
import { InsufficientSimStockError } from '../../domain/errors/insufficient-sim-stock.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { RechargeSimDailyStockOrmEntity } from './recharge-sim-daily-stock.orm-entity';
import { RechargeSimDailyStockMapper } from './recharge-sim-daily-stock.mapper';

interface MovementTotals {
  purchasedQuantity: number;
  purchasedTotal: number;
  soldQuantity: number;
  soldTotal: number;
}

const EMPTY_MOVEMENTS: MovementTotals = {
  purchasedQuantity: 0,
  purchasedTotal: 0,
  soldQuantity: 0,
  soldTotal: 0,
};

@Injectable()
export class TypeOrmRechargeSimDailyStockRepository implements RechargeSimDailyStockRepository {
  constructor(
    @InjectRepository(RechargeSimDailyStockOrmEntity)
    private readonly repository: Repository<RechargeSimDailyStockOrmEntity>,
  ) {}

  async ensureDailyStock(
    simTypeId: string,
    date: string,
    userId: string,
  ): Promise<RechargeSimDailyStock> {
    let id: string;
    try {
      const rows = await this.repository.manager.query<
        { ensure_recharge_sim_daily_stock: string }[]
      >('SELECT ensure_recharge_sim_daily_stock($1, $2, $3)', [
        simTypeId,
        date,
        userId,
      ]);
      id = rows[0].ensure_recharge_sim_daily_stock;
    } catch (error) {
      throw this.translateSimError(error);
    }
    return this.fetchOrThrow(id);
  }

  async findAllByDate(date: string): Promise<RechargeSimDailyStock[]> {
    const orms = await this.repository.find({
      where: { date },
      order: { simType: { name: 'ASC' } },
    });
    const movements = await this.sumMovements(orms.map((orm) => orm.id));
    return orms.map((orm) =>
      RechargeSimDailyStockMapper.toDomain(
        orm,
        movements.get(orm.id) ?? EMPTY_MOVEMENTS,
      ),
    );
  }

  async findById(id: string): Promise<RechargeSimDailyStock | null> {
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) {
      return null;
    }
    const movements = await this.sumMovements([orm.id]);
    return RechargeSimDailyStockMapper.toDomain(
      orm,
      movements.get(orm.id) ?? EMPTY_MOVEMENTS,
    );
  }

  async registerPurchase(
    data: RegisterRechargeSimPurchaseData,
  ): Promise<RechargeSimDailyStock> {
    let dailyStockId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_recharge_sim_purchase: string }[]
      >('SELECT register_recharge_sim_purchase($1, $2, $3, $4)', [
        data.simTypeId,
        data.date,
        data.quantity,
        data.userId,
      ]);
      dailyStockId = rows[0].register_recharge_sim_purchase;
    } catch (error) {
      throw this.translateSimError(error);
    }
    return this.fetchOrThrow(dailyStockId);
  }

  async registerSale(
    data: RegisterRechargeSimSaleData,
  ): Promise<RechargeSimDailyStock> {
    let dailyStockId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_recharge_sim_sale: string }[]
      >('SELECT register_recharge_sim_sale($1, $2, $3, $4)', [
        data.simTypeId,
        data.date,
        data.quantity,
        data.userId,
      ]);
      dailyStockId = rows[0].register_recharge_sim_sale;
    } catch (error) {
      throw this.translateSimError(error);
    }
    return this.fetchOrThrow(dailyStockId);
  }

  /** Real `SUM(quantity)`/`SUM(total)` per `daily_stock_id`, one bulk query per table — raw SQL (no ORM entity exists for these write-heavy movement tables, same "no ORM entity for a movement audit trail" precedent `recharge_purchases` already established) rather than a QueryBuilder join. */
  private async sumMovements(
    dailyStockIds: string[],
  ): Promise<Map<string, MovementTotals>> {
    const totals = new Map<string, MovementTotals>();
    if (dailyStockIds.length === 0) {
      return totals;
    }

    const purchaseRows = await this.repository.manager.query<
      { daily_stock_id: string; quantity: string; total: string }[]
    >(
      `SELECT daily_stock_id, SUM(quantity) AS quantity, SUM(total_cost) AS total FROM recharge_sim_purchases WHERE daily_stock_id = ANY($1) GROUP BY daily_stock_id`,
      [dailyStockIds],
    );
    const saleRows = await this.repository.manager.query<
      { daily_stock_id: string; quantity: string; total: string }[]
    >(
      `SELECT daily_stock_id, SUM(quantity) AS quantity, SUM(total_amount) AS total FROM recharge_sim_sales WHERE daily_stock_id = ANY($1) GROUP BY daily_stock_id`,
      [dailyStockIds],
    );

    for (const id of dailyStockIds) {
      totals.set(id, { ...EMPTY_MOVEMENTS });
    }
    for (const row of purchaseRows) {
      const entry = totals.get(row.daily_stock_id) ?? { ...EMPTY_MOVEMENTS };
      entry.purchasedQuantity = parseInt(row.quantity, 10);
      entry.purchasedTotal = parseFloat(row.total);
      totals.set(row.daily_stock_id, entry);
    }
    for (const row of saleRows) {
      const entry = totals.get(row.daily_stock_id) ?? { ...EMPTY_MOVEMENTS };
      entry.soldQuantity = parseInt(row.quantity, 10);
      entry.soldTotal = parseFloat(row.total);
      totals.set(row.daily_stock_id, entry);
    }

    return totals;
  }

  private async fetchOrThrow(id: string): Promise<RechargeSimDailyStock> {
    const stock = await this.findById(id);
    if (!stock) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el stock de SIM recién actualizado.',
      );
    }
    return stock;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<extra>'` → domain-error translation pattern as `TypeOrmRechargeDailyBalanceRepository.translateRechargeError`. */
  private translateSimError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'SIM_TYPE_NOT_FOUND':
        return new SimTypeNotFoundError(message.split(':')[1] ?? '');
      case 'SIM_TYPE_INACTIVE':
        return new SimTypeInactiveError();
      case 'INVALID_SIM_QUANTITY':
        return new InvalidSimQuantityError();
      case 'INSUFFICIENT_SIM_STOCK':
        return new InsufficientSimStockError();
      case 'RECHARGE_DAY_CLOSED':
        return new RechargeDayAlreadyClosedError(message.split(':')[1] ?? '');
      default:
        return error;
    }
  }
}

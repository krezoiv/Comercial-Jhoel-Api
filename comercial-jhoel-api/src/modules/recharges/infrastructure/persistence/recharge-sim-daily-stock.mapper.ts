import { RechargeSimDailyStock } from '../../domain/entities/recharge-sim-daily-stock.entity';
import { RechargeSimDailyStockOrmEntity } from './recharge-sim-daily-stock.orm-entity';

export class RechargeSimDailyStockMapper {
  /** `purchasedQuantity`/`purchasedTotal`/`soldQuantity`/`soldTotal` are always supplied explicitly by the repository (real `SUM()` queries against `recharge_sim_purchases`/`recharge_sim_sales`) — never defaulted here. */
  static toDomain(
    orm: RechargeSimDailyStockOrmEntity,
    movements: {
      purchasedQuantity: number;
      purchasedTotal: number;
      soldQuantity: number;
      soldTotal: number;
    },
  ): RechargeSimDailyStock {
    return RechargeSimDailyStock.create({
      id: orm.id,
      simTypeId: orm.simTypeId,
      simTypeName: orm.simType?.name ?? '—',
      date: orm.date,
      previousStock: orm.previousStock,
      currentStock: orm.currentStock,
      purchasedQuantity: movements.purchasedQuantity,
      purchasedTotal: movements.purchasedTotal,
      soldQuantity: movements.soldQuantity,
      soldTotal: movements.soldTotal,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '—',
      updatedByUserId: orm.updatedByUserId,
      updatedByUsername: orm.updatedByUser?.username ?? null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

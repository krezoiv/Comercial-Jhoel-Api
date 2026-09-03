import { RechargeDailyBalance } from '../../domain/entities/recharge-daily-balance.entity';
import { RechargeDailyBalanceOrmEntity } from './recharge-daily-balance.orm-entity';

export class RechargeDailyBalanceMapper {
  /** `totalPurchaseAmount` is always supplied explicitly by the repository (a real `SUM(recharge_purchases.amount)` query) — never defaulted here, so a call site can't silently forget it. */
  static toDomain(
    orm: RechargeDailyBalanceOrmEntity,
    totalPurchaseAmount: number,
  ): RechargeDailyBalance {
    return RechargeDailyBalance.create({
      id: orm.id,
      rechargeTypeId: orm.rechargeTypeId,
      rechargeTypeName: orm.rechargeType?.name ?? '—',
      date: orm.date,
      sequence: orm.sequence,
      previousBalance: orm.previousBalance,
      dailyBalance: orm.dailyBalance,
      finalBalance: orm.finalBalance,
      totalPurchaseAmount,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '—',
      updatedByUserId: orm.updatedByUserId,
      updatedByUsername: orm.updatedByUser?.username ?? null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

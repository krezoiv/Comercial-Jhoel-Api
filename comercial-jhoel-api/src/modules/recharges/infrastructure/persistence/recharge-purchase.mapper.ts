import { RechargePurchase } from '../../domain/entities/recharge-purchase.entity';
import { RechargePurchaseFullOrmEntity } from './recharge-purchase-full.orm-entity';

export class RechargePurchaseMapper {
  static toDomain(orm: RechargePurchaseFullOrmEntity): RechargePurchase {
    return RechargePurchase.create({
      id: orm.id,
      rechargeTypeId: orm.rechargeTypeId,
      rechargeTypeName: orm.rechargeType?.name ?? '—',
      dailyBalanceId: orm.dailyBalanceId,
      amount: orm.amount,
      creditedAmount: orm.creditedAmount,
      date: orm.date,
      locked: (orm.dailyBalance?.finalBalance ?? null) !== null,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '—',
      createdAt: orm.createdAt,
      isVoided: orm.isVoided,
      voidedAt: orm.voidedAt,
      voidedByUserId: orm.voidedByUserId,
      voidedByUsername: orm.voidedByUser?.username ?? null,
      voidReason: orm.voidReason,
    });
  }
}

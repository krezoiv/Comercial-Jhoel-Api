import { RechargeSale } from '../../domain/entities/recharge-sale.entity';
import { RechargeSaleOrmEntity } from './recharge-sale.orm-entity';

export class RechargeSaleMapper {
  static toDomain(orm: RechargeSaleOrmEntity): RechargeSale {
    return RechargeSale.create({
      id: orm.id,
      rechargeTypeId: orm.rechargeTypeId,
      rechargeTypeName: orm.rechargeType?.name ?? '—',
      dailyBalanceId: orm.dailyBalanceId,
      phoneNumber: orm.phoneNumber,
      amount: orm.amount,
      date: orm.date,
      locked: (orm.dailyBalance?.finalBalance ?? null) !== null,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '—',
      updatedByUserId: orm.updatedByUserId,
      updatedByUsername: orm.updatedByUser?.username ?? null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

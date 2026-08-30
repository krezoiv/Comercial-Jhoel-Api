import { RechargeSalesClosure } from '../../domain/entities/recharge-sales-closure.entity';
import { RechargeSalesClosureOrmEntity } from './recharge-sales-closure.orm-entity';

export class RechargeSalesClosureMapper {
  static toDomain(orm: RechargeSalesClosureOrmEntity): RechargeSalesClosure {
    return RechargeSalesClosure.create({
      id: orm.id,
      date: orm.date,
      sequence: orm.sequence,
      totalSales: orm.totalSales,
      totalCollected: orm.totalCollected,
      result: orm.result,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '—',
      updatedByUserId: orm.updatedByUserId,
      updatedByUsername: orm.updatedByUser?.username ?? null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

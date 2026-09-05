import { Asset } from '../../domain/entities/asset.entity';
import { AssetOrmEntity } from './asset.orm-entity';

export class AssetMapper {
  static toDomain(orm: AssetOrmEntity): Asset {
    return Asset.create({
      id: orm.id,
      clientId: orm.clientId,
      clientName: orm.client?.name ?? '',
      date: orm.date,
      amount: orm.amount,
      movementType: orm.movementType,
      sequence: Number(orm.sequence),
      description: orm.description,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}

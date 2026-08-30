import { IceCream } from '../../domain/entities/ice-cream.entity';
import { IceCreamOrmEntity } from './ice-cream.orm-entity';

export class IceCreamMapper {
  static toDomain(orm: IceCreamOrmEntity): IceCream {
    return IceCream.create({
      id: orm.id,
      sku: orm.sku,
      product: orm.product,
      costPrice: orm.costPrice,
      publicPrice: orm.publicPrice,
      stock: orm.stock,
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

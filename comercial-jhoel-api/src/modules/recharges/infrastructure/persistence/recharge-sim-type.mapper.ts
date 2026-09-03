import { RechargeSimType } from '../../domain/entities/recharge-sim-type.entity';
import { RechargeSimTypeOrmEntity } from './recharge-sim-type.orm-entity';

export class RechargeSimTypeMapper {
  static toDomain(orm: RechargeSimTypeOrmEntity): RechargeSimType {
    return RechargeSimType.create({
      id: orm.id,
      name: orm.name,
      costPrice: orm.costPrice,
      publicPrice: orm.publicPrice,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

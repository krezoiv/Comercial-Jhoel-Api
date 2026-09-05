import { RechargeType } from '../../domain/entities/recharge-type.entity';
import { RechargeTypeOrmEntity } from './recharge-type.orm-entity';

export class RechargeTypeMapper {
  static toDomain(orm: RechargeTypeOrmEntity): RechargeType {
    return RechargeType.create({
      id: orm.id,
      name: orm.name,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      minBalance: orm.minBalance,
    });
  }
}

import { RechargeCashBoxMovement } from '../../domain/entities/recharge-cash-box-movement.entity';
import { RechargeCashBoxMovementOrmEntity } from './recharge-cash-box-movement.orm-entity';

export class RechargeCashBoxMovementMapper {
  static toDomain(
    orm: RechargeCashBoxMovementOrmEntity,
  ): RechargeCashBoxMovement {
    return RechargeCashBoxMovement.create({
      id: orm.id,
      amount: orm.amount,
      movementType: orm.movementType,
      businessDate: orm.businessDate,
      concept: orm.concept,
      createdByUserId: orm.createdByUserId,
      createdByUsername: orm.createdByUser?.username ?? '',
      createdAt: orm.createdAt,
      isVoided: orm.isVoided,
      voidedAt: orm.voidedAt,
      voidedByUserId: orm.voidedByUserId,
      voidedByUsername: orm.voidedByUser?.username ?? null,
      voidReason: orm.voidReason,
    });
  }
}

import { SalesCashBoxMovement } from '../../domain/entities/sales-cash-box-movement.entity';
import { SalesCashBoxMovementOrmEntity } from './sales-cash-box-movement.orm-entity';

export class SalesCashBoxMovementMapper {
  static toDomain(orm: SalesCashBoxMovementOrmEntity): SalesCashBoxMovement {
    return SalesCashBoxMovement.create({
      id: orm.id,
      businessId: orm.businessId,
      amount: orm.amount,
      movementType: orm.movementType,
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

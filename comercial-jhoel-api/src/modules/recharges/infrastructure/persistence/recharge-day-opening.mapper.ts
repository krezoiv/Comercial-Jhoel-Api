import { RechargeDayOpening } from '../../domain/entities/recharge-day-opening.entity';
import { RechargeDayOpeningOrmEntity } from './recharge-day-opening.orm-entity';

export class RechargeDayOpeningMapper {
  static toDomain(orm: RechargeDayOpeningOrmEntity): RechargeDayOpening {
    return RechargeDayOpening.create({
      id: orm.id,
      date: orm.date,
      openedBy: orm.openedBy,
      openedByUsername: orm.openedByUser?.username ?? '',
      openedAt: orm.openedAt,
      closedAt: orm.closedAt,
      closedBy: orm.closedBy,
      closedByUsername: orm.closedByUser?.username ?? '',
      reopenedAt: orm.reopenedAt,
      reopenedBy: orm.reopenedBy,
      reopenedByUsername: orm.reopenedByUser?.username ?? '',
      reopenReason: orm.reopenReason,
      isCancelled: orm.isCancelled,
      cancelledAt: orm.cancelledAt,
      cancelledBy: orm.cancelledBy,
      cancelledByUsername: orm.cancelledByUser?.username ?? '',
      cancelReason: orm.cancelReason,
    });
  }
}

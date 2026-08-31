import { DayOpening } from '../../domain/entities/day-opening.entity';
import { DayOpeningOrmEntity } from './day-opening.orm-entity';

export class DayOpeningMapper {
  static toDomain(orm: DayOpeningOrmEntity): DayOpening {
    return DayOpening.create({
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

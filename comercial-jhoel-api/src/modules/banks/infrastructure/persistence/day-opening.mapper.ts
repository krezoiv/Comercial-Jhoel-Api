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
    });
  }
}

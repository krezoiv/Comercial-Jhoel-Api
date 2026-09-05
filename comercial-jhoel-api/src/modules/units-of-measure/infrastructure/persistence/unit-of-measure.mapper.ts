import { UnitOfMeasure } from '../../domain/entities/unit-of-measure.entity';
import { UnitOfMeasureOrmEntity } from './unit-of-measure.orm-entity';

export class UnitOfMeasureMapper {
  static toDomain(orm: UnitOfMeasureOrmEntity): UnitOfMeasure {
    return UnitOfMeasure.create({
      id: orm.id,
      name: orm.name,
      abbreviation: orm.abbreviation,
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

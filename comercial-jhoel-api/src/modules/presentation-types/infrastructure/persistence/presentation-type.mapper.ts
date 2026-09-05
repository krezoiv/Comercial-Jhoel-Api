import { PresentationType } from '../../domain/entities/presentation-type.entity';
import { PresentationTypeOrmEntity } from './presentation-type.orm-entity';

export class PresentationTypeMapper {
  static toDomain(orm: PresentationTypeOrmEntity): PresentationType {
    return PresentationType.create({
      id: orm.id,
      name: orm.name,
      code: orm.code,
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

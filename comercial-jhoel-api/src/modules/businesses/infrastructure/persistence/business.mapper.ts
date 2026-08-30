import { Business } from '../../domain/entities/business.entity';
import { BusinessOrmEntity } from './business.orm-entity';

export class BusinessMapper {
  static toDomain(orm: BusinessOrmEntity): Business {
    return Business.create({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

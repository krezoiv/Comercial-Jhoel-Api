import { Category } from '../../domain/entities/category.entity';
import { CategoryOrmEntity } from './category.orm-entity';

export class CategoryMapper {
  static toDomain(orm: CategoryOrmEntity): Category {
    return Category.create({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}

import { NewsType } from '../../domain/entities/news-type.entity';
import { NewsTypeOrmEntity } from './news-type.orm-entity';

export class NewsTypeMapper {
  static toDomain(orm: NewsTypeOrmEntity): NewsType {
    return NewsType.create({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      description: orm.description,
      isWildcard: orm.isWildcard,
      isActive: orm.isActive,
      sortOrder: orm.sortOrder,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? orm.createdByUser?.name ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? orm.updatedByUser?.name ?? null,
    });
  }
}

import { NewsArticle } from '../../domain/entities/news-article.entity';
import { NewsArticleOrmEntity } from './news-article.orm-entity';

export class NewsArticleMapper {
  static toDomain(orm: NewsArticleOrmEntity): NewsArticle {
    return NewsArticle.create({
      id: orm.id,
      title: orm.title,
      slug: orm.slug,
      description: orm.description,
      publishedAt: orm.publishedAt,
      newsTypeId: orm.newsTypeId,
      newsTypeName: orm.newsType?.name ?? '',
      isActive: orm.isActive,
      sortOrder: orm.sortOrder,
      likesCount: orm.likesCount,
      hasImage: orm.imageMimeType !== null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? orm.createdByUser?.name ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? orm.updatedByUser?.name ?? null,
    });
  }
}

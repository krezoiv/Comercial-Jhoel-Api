import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import { PublicNewsArticleOutput, toPublicNewsArticleOutput } from '../dtos/news-article-output';

/** Backs Noticias en la landing — solo activas, ordenadas por sortOrder y fecha de publicación reciente. */
@Injectable()
export class ListPublishedNewsArticlesUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(visitorId?: string): Promise<PublicNewsArticleOutput[]> {
    const articles = await this.newsArticleRepository.findPublished();
    const ids = articles.map((article) => article.id);
    const [counts, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCountsBatch('NEWS', ids),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('NEWS', visitorId, ids)
        : Promise.resolve(new Set<string>()),
    ]);
    return articles.map((article) =>
      toPublicNewsArticleOutput(article, counts.get(article.id) ?? 0, likedIds.has(article.id)),
    );
  }
}

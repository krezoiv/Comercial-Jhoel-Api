import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import { PublicNewsArticleOutput, toPublicNewsArticleOutput } from '../dtos/news-article-output';

/** Backs la URL pública real `/noticias/:slug` — mismo criterio de "no revela existencia" que la versión por id: 404 tanto si no existe como si está inactiva. */
@Injectable()
export class GetPublishedNewsArticleBySlugUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(slug: string, visitorId?: string): Promise<PublicNewsArticleOutput> {
    const article = await this.newsArticleRepository.findPublishedBySlug(slug);
    if (!article) {
      throw new NewsArticleNotVisibleError();
    }
    const [likesCount, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCount('NEWS', article.id),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('NEWS', visitorId, [article.id])
        : Promise.resolve(new Set<string>()),
    ]);
    return toPublicNewsArticleOutput(article, likesCount, likedIds.has(article.id));
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type { CatalogLikeRepository } from '../../../likes/domain/repositories/catalog-like.repository';
import { PublicNewsArticleOutput, toPublicNewsArticleOutput } from '../dtos/news-article-output';

@Injectable()
export class GetPublishedNewsArticleByIdUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(id: string, visitorId?: string): Promise<PublicNewsArticleOutput> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article || !article.isActive) {
      throw new NewsArticleNotVisibleError();
    }
    const [likesCount, likedIds] = await Promise.all([
      this.catalogLikeRepository.getCount('NEWS', id),
      visitorId
        ? this.catalogLikeRepository.getLikedEntityIds('NEWS', visitorId, [id])
        : Promise.resolve(new Set<string>()),
    ]);
    return toPublicNewsArticleOutput(article, likesCount, likedIds.has(id));
  }
}

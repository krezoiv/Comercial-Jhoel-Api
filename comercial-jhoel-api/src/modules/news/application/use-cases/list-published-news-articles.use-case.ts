import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { PublicNewsArticleOutput, toPublicNewsArticleOutput } from '../dtos/news-article-output';

/** Backs Noticias en la landing — solo activas, ordenadas por sortOrder y fecha de publicación reciente. */
@Injectable()
export class ListPublishedNewsArticlesUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(): Promise<PublicNewsArticleOutput[]> {
    const articles = await this.newsArticleRepository.findPublished();
    return articles.map(toPublicNewsArticleOutput);
  }
}

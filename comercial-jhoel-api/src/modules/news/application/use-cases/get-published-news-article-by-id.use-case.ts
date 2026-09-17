import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';
import { PublicNewsArticleOutput, toPublicNewsArticleOutput } from '../dtos/news-article-output';

@Injectable()
export class GetPublishedNewsArticleByIdUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string): Promise<PublicNewsArticleOutput> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article || !article.isActive) {
      throw new NewsArticleNotVisibleError();
    }
    return toPublicNewsArticleOutput(article);
  }
}

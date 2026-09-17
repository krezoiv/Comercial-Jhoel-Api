import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

@Injectable()
export class GetNewsArticleByIdUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string): Promise<NewsArticleOutput> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article) {
      throw new NewsArticleNotFoundError(id);
    }
    return toNewsArticleOutput(article);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type {
  NewsArticleRepository,
  ReorderNewsArticleItem,
} from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';

@Injectable()
export class ReorderNewsArticlesUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(items: ReorderNewsArticleItem[]): Promise<void> {
    for (const item of items) {
      const article = await this.newsArticleRepository.findById(item.id);
      if (!article) {
        throw new NewsArticleNotFoundError(item.id);
      }
    }
    await this.newsArticleRepository.reorder(items);
  }
}

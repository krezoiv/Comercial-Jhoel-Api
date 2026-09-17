import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type {
  NewsArticleRepository,
  ListNewsArticlesOptions,
} from '../../domain/repositories/news-article.repository';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

@Injectable()
export class ListNewsArticlesUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(options?: ListNewsArticlesOptions): Promise<NewsArticleOutput[]> {
    const articles = await this.newsArticleRepository.findAll(options);
    return articles.map(toNewsArticleOutput);
  }
}

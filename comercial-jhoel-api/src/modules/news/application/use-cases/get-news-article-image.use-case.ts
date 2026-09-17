import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';

export interface NewsArticleImageBytesOutput {
  data: Buffer;
  mimeType: string;
}

/** Público, sin guard — pero valida que la noticia siga activa: desactivarla oculta también su imagen. */
@Injectable()
export class GetNewsArticleImageUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string): Promise<NewsArticleImageBytesOutput> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article || !article.isActive) {
      throw new NewsArticleNotVisibleError();
    }

    const image = await this.newsArticleRepository.getImage(id);
    if (!image) {
      throw new NewsArticleNotVisibleError();
    }

    return { data: image.data, mimeType: image.mimeType };
  }
}

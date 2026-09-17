import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';
import {
  assertValidNewsArticleImage,
  UploadedNewsArticleImage,
} from '../utils/assert-valid-news-article-image';

export interface SetNewsArticleImageInput {
  newsArticleId: string;
  image: UploadedNewsArticleImage;
  userId: string;
}

/** Subir = reemplazar — una sola imagen principal por noticia. */
@Injectable()
export class SetNewsArticleImageUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(input: SetNewsArticleImageInput): Promise<void> {
    assertValidNewsArticleImage(input.image);

    const article = await this.newsArticleRepository.findById(input.newsArticleId);
    if (!article) {
      throw new NewsArticleNotFoundError(input.newsArticleId);
    }

    await this.newsArticleRepository.setImage(
      input.newsArticleId,
      {
        data: input.image.buffer,
        mimeType: input.image.mimetype,
        sizeBytes: input.image.size,
      },
      input.userId,
    );
  }
}

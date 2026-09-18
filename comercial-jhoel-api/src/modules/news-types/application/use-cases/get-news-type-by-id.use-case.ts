import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { NewsTypeNotFoundError } from '../../domain/errors/news-type-not-found.error';
import { NewsTypeOutput, toNewsTypeOutput } from '../dtos/news-type-output';

@Injectable()
export class GetNewsTypeByIdUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(id: string): Promise<NewsTypeOutput> {
    const newsType = await this.newsTypeRepository.findById(id);
    if (!newsType) {
      throw new NewsTypeNotFoundError(id);
    }
    return toNewsTypeOutput(newsType);
  }
}

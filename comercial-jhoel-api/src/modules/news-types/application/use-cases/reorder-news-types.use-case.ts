import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository, ReorderNewsTypeItem } from '../../domain/repositories/news-type.repository';
import { NewsTypeNotFoundError } from '../../domain/errors/news-type-not-found.error';

@Injectable()
export class ReorderNewsTypesUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(items: ReorderNewsTypeItem[]): Promise<void> {
    for (const item of items) {
      const newsType = await this.newsTypeRepository.findById(item.id);
      if (!newsType) {
        throw new NewsTypeNotFoundError(item.id);
      }
    }
    await this.newsTypeRepository.reorder(items);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { NewsTypeListOutput, toNewsTypeListOutput } from '../dtos/news-type-output';

export interface ListNewsTypesInput {
  includeInactive?: boolean;
  search?: string;
}

@Injectable()
export class ListNewsTypesUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(input: ListNewsTypesInput = {}): Promise<NewsTypeListOutput[]> {
    const items = await this.newsTypeRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
    });
    return items.map(toNewsTypeListOutput);
  }
}

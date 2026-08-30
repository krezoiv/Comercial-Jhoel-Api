import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryOutput, toCategoryOutput } from '../dtos/category-output';

export interface ListCategoriesInput {
  activeOnly?: boolean;
}

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: ListCategoriesInput = {}): Promise<CategoryOutput[]> {
    const categories = await this.categoryRepository.findAll({
      activeOnly: input.activeOnly ?? false,
    });
    return categories.map(toCategoryOutput);
  }
}

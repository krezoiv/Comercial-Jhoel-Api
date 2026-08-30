import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryOutput, toCategoryOutput } from '../dtos/category-output';

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CategoryOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing = await this.categoryRepository.findByName(name);
    if (existing) {
      throw new CategoryNameAlreadyExistsError(name);
    }

    const category = await this.categoryRepository.create({
      name,
      description: input.description?.trim() || null,
    });
    return toCategoryOutput(category);
  }
}
